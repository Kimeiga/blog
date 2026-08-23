import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const postsRoot = resolve(root, 'src/content/posts/imported');
const imagesRoot = resolve(root, 'public/images/imported');

const WP_SITE = 'https://kimeiga.wordpress.com';
const WP_API = 'https://public-api.wordpress.com/rest/v1.1/sites/kimeiga.wordpress.com';
const SUBSTACK = 'https://deltastar.substack.com';

const imported = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchResponse(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Hakan-Alpay-Blog-Archive-Importer/1.0 (+https://hakanalpay.com/blog)',
          Accept: '*/*',
        },
        redirect: 'follow',
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(attempt * 800);
    }
  }
  throw new Error(`Unable to fetch ${url}: ${lastError}`);
}

async function fetchText(url) {
  return (await fetchResponse(url)).text();
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

function decodeEntities(value = '') {
  return String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function stripHtml(value = '') {
  return decodeEntities(String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function descriptionFrom(value = '') {
  const text = stripHtml(value);
  if (!text) return 'Imported from Hakan Alpay’s earlier public writing archive.';
  return text.length <= 240 ? text : `${text.slice(0, 237).replace(/\s+\S*$/, '')}…`;
}

function yaml(value) {
  return JSON.stringify(String(value));
}

function slugify(value) {
  return decodeEntities(String(value))
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'untitled';
}

function safeFilename(value, fallback) {
  const clean = decodeURIComponent(value || '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean && clean !== '.' ? clean : fallback;
}

function extensionFor(contentType, url) {
  const fromUrl = extname(new URL(url).pathname).toLowerCase();
  if (/^\.(?:jpe?g|png|gif|webp|avif)$/i.test(fromUrl)) return fromUrl === '.jpeg' ? '.jpg' : fromUrl;
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  return ({
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/avif': '.avif',
  })[type] || '.jpg';
}

function isArticleImageUrl(url, source) {
  if (!/^https?:\/\//i.test(url)) return false;
  if (source === 'wordpress') return /(?:wordpress\.com|wp\.com)\/wp-content\/uploads\//i.test(url);
  return /substackcdn\.com\/image\/fetch|bucketeer-[^/]+\.s3\.amazonaws\.com\/public\/images|images\.unsplash\.com/i.test(url);
}

function collectArticleImageUrls(html, source) {
  const urls = new Set();
  for (const match of String(html).matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)["']/gi)) {
    const decoded = decodeEntities(match[1]);
    if (isArticleImageUrl(decoded, source)) urls.add(decoded);
  }
  return [...urls];
}

async function localizeImages(html, source, slug) {
  let output = String(html)
    .replace(/\s+srcset=["'][^"']*["']/gi, '')
    .replace(/\s+data-srcset=["'][^"']*["']/gi, '');

  const urls = collectArticleImageUrls(output, source);
  const sourceDir = source === 'wordpress' ? 'wordpress' : 'substack';
  const destinationDir = resolve(imagesRoot, sourceDir, slug);
  await mkdir(destinationDir, { recursive: true });

  let index = 0;
  const canonicalToLocal = new Map();
  for (const originalUrl of urls) {
    index += 1;
    let fetchUrl = originalUrl;
    if (source === 'wordpress') {
      const u = new URL(originalUrl);
      u.search = '';
      fetchUrl = u.toString();
    }

    const canonical = source === 'wordpress' ? fetchUrl : originalUrl;
    let localUrl = canonicalToLocal.get(canonical);
    if (!localUrl) {
      const response = await fetchResponse(fetchUrl);
      const bytes = Buffer.from(await response.arrayBuffer());
      const ext = extensionFor(response.headers.get('content-type'), fetchUrl);
      const base = safeFilename(basename(new URL(fetchUrl).pathname, extname(new URL(fetchUrl).pathname)), `image-${String(index).padStart(3, '0')}${ext}`);
      const name = extname(base) ? base : `${base}${ext}`;
      const filePath = resolve(destinationDir, name);
      await writeFile(filePath, bytes);
      localUrl = `/blog/images/imported/${sourceDir}/${slug}/${name}`;
      canonicalToLocal.set(canonical, localUrl);
      console.log(`Saved ${sourceDir}/${slug}/${name}`);
    }

    const encodedUrl = originalUrl.replace(/&/g, '&amp;');
    output = output.split(originalUrl).join(localUrl).split(encodedUrl).join(localUrl);
  }

  return output;
}

function frontmatter({ title, description, published, updated, tags = [], sourceUrl }) {
  const lines = [
    '---',
    `title: ${yaml(title)}`,
    `description: ${yaml(description)}`,
    `published: ${yaml(published)}`,
  ];
  if (updated && new Date(updated).valueOf() > new Date(published).valueOf() + 60_000) {
    lines.push(`updated: ${yaml(updated)}`);
  }
  lines.push(`tags: [${tags.map(yaml).join(', ')}]`);
  lines.push('draft: false');
  lines.push('featured: false');
  lines.push(`legacySource: ${yaml(sourceUrl)}`);
  lines.push('---', '');
  return lines.join('\n');
}

async function writeImportedPost(source, slug, meta, bodyHtml) {
  const dir = resolve(postsRoot, source);
  await mkdir(dir, { recursive: true });
  const localized = await localizeImages(bodyHtml, source, slug);
  const cleaned = localized
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .trim();
  const path = resolve(dir, `${slug}.md`);
  await writeFile(path, `${frontmatter(meta)}<!-- Imported from ${meta.sourceUrl}. Original article HTML is retained below. -->\n\n${cleaned}\n`);
  imported.push({ source, slug, title: meta.title, published: meta.published, sourceUrl: meta.sourceUrl });
  console.log(`Imported ${source}: ${meta.title}`);
}

function originalTaxonomy(post) {
  const names = new Set();
  for (const container of [post.categories, post.tags]) {
    if (!container) continue;
    if (Array.isArray(container)) {
      for (const item of container) names.add(typeof item === 'string' ? item : item?.name);
    } else {
      for (const [key, item] of Object.entries(container)) names.add(item?.name || key);
    }
  }
  return [...names].filter(Boolean).slice(0, 12);
}

async function importWordPress() {
  const data = await fetchJson(`${WP_API}/posts/?number=100`);
  const posts = data.posts || [];
  if (data.found && posts.length < Math.min(data.found, 100)) {
    throw new Error(`WordPress returned ${posts.length} of ${data.found} posts.`);
  }

  for (const post of posts) {
    if (post.status && post.status !== 'publish') continue;
    const rawSlug = post.slug || new URL(post.URL).pathname.split('/').filter(Boolean).at(-1) || slugify(post.title);
    const slug = decodeURIComponent(rawSlug);
    const title = stripHtml(post.title) || slug;
    await writeImportedPost('wordpress', slug, {
      title,
      description: descriptionFrom(post.content || post.excerpt),
      published: post.date,
      updated: post.modified,
      tags: originalTaxonomy(post),
      sourceUrl: post.URL,
    }, post.content || '');
  }

  // Lonely-CLA is a standalone WordPress page rather than a post.
  let lonely;
  try {
    const pages = await fetchJson(`${WP_API}/posts/?number=100&type=page`);
    lonely = (pages.posts || []).find((page) => /\/lonely-cla\/?$/i.test(page.URL || '') || page.slug === 'lonely-cla');
  } catch {
    // Fall through to HTML extraction below.
  }

  if (lonely) {
    await writeImportedPost('wordpress', 'lonely-cla', {
      title: stripHtml(lonely.title) || 'Lonely-CLA',
      description: descriptionFrom(lonely.content || lonely.excerpt),
      published: lonely.date || '2020-09-29',
      updated: lonely.modified,
      tags: originalTaxonomy(lonely),
      sourceUrl: `${WP_SITE}/lonely-cla/`,
    }, lonely.content || '');
  } else {
    const html = await fetchText(`${WP_SITE}/lonely-cla/`);
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
    if (!article) throw new Error('Could not extract Lonely-CLA article HTML.');
    const body = article
      .replace(/<header\b[^>]*>[\s\S]*?<\/header>/i, '')
      .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i, '');
    await writeImportedPost('wordpress', 'lonely-cla', {
      title: 'Lonely-CLA',
      description: descriptionFrom(body),
      published: '2020-09-29',
      tags: [],
      sourceUrl: `${WP_SITE}/lonely-cla/`,
    }, body);
  }

  return posts.length + 1;
}

function xmlValue(block, tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
  if (!match) return '';
  return decodeEntities(match[1].replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1').trim());
}

function rssItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
    const block = match[1];
    return {
      title: xmlValue(block, 'title'),
      link: xmlValue(block, 'link'),
      date: xmlValue(block, 'pubDate'),
      content: xmlValue(block, 'content:encoded') || xmlValue(block, 'description'),
      categories: [...block.matchAll(/<category(?:\s[^>]*)?><!\[CDATA\[([\s\S]*?)\]\]><\/category>/gi)].map((m) => decodeEntities(m[1]).trim()),
    };
  });
}

async function importSubstack() {
  const [xml, archiveHtml] = await Promise.all([
    fetchText(`${SUBSTACK}/feed`),
    fetchText(`${SUBSTACK}/archive?sort=new`),
  ]);
  const items = rssItems(xml).filter((item) => /\/p\//.test(item.link));
  if (!items.length) throw new Error('Substack RSS returned no posts.');

  const archiveLinks = new Set();
  for (const match of archiveHtml.matchAll(/https:\/\/deltastar\.substack\.com\/p\/[a-zA-Z0-9_-]+|href=["'](\/p\/[a-zA-Z0-9_-]+)["']/g)) {
    const value = match[1] || match[0];
    const url = value.startsWith('/') ? `${SUBSTACK}${value}` : value;
    archiveLinks.add(url.replace(/["']$/g, ''));
  }
  const feedLinks = new Set(items.map((item) => item.link.replace(/\/$/, '')));
  const missing = [...archiveLinks].map((url) => url.replace(/\/$/, '')).filter((url) => !feedLinks.has(url));
  if (missing.length) {
    throw new Error(`Substack archive contains ${missing.length} post(s) absent from RSS: ${missing.join(', ')}`);
  }

  for (const item of items) {
    const rawSlug = new URL(item.link).pathname.split('/').filter(Boolean).at(-1) || slugify(item.title);
    const slug = decodeURIComponent(rawSlug);
    await writeImportedPost('substack', slug, {
      title: stripHtml(item.title) || slug,
      description: descriptionFrom(item.content),
      published: new Date(item.date).toISOString(),
      tags: item.categories.filter(Boolean).slice(0, 12),
      sourceUrl: item.link,
    }, item.content);
  }
  return items.length;
}

await rm(postsRoot, { recursive: true, force: true });
await rm(imagesRoot, { recursive: true, force: true });
await mkdir(postsRoot, { recursive: true });
await mkdir(imagesRoot, { recursive: true });

const wordpressCount = await importWordPress();
const substackCount = await importSubstack();

const report = [
  '# Public archive import',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `- WordPress posts/page: ${wordpressCount}`,
  `- Substack posts: ${substackCount}`,
  `- Total imported: ${imported.length}`,
  '',
  '## Imported items',
  '',
  ...imported
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .map((item) => `- ${item.published.slice(0, 10)} — **${item.title}** — ${item.sourceUrl}`),
  '',
  'The importer retains the rendered article HTML, downloads article images into `public/images/imported/`, removes remote responsive `srcset` variants, and records the original URL as `legacySource`.',
  '',
].join('\n');
await writeFile(resolve(root, 'docs/PUBLIC_ARCHIVE_IMPORT.md'), report);

console.log(`Imported ${imported.length} public archive items (${wordpressCount} WordPress, ${substackCount} Substack).`);
