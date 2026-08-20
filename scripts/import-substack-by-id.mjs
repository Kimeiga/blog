import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const postsDir = resolve(root, 'src/content/posts/imported/substack');
const imagesRoot = resolve(root, 'public/images/imported/substack');
const wordpressDir = resolve(root, 'src/content/posts/imported/wordpress');

// Verified against https://deltastar.substack.com/archive?sort=new on 2026-08-20.
// The publication has 12 public archive entries. Numeric IDs let CI use
// Substack's bare-host public read endpoint, which is accessible even when the
// publication subdomain rejects GitHub Actions' datacenter IPs.
const POSTS = [
  [198800519, 'in-life-there-is-rain'],
  [168033991, 'yerkes-dodson-law'],
  [157747890, 'on-the-benign-unprovability-of-our'],
  [157272287, 'american-urbanism-focuses-too-much'],
  [149212832, 'on-the-unprovability-of-our-perception'],
  [148002077, 'how-do-you-stay-focused-when-your'],
  [50352471, 'stuck-on-repeat'],
  [43143079, 'code-flow'],
  [43086863, 'thoughts-and-the-loneliness-that'],
  [43085243, 'how-much-will-we-let-identity-matter'],
  [43084478, 'the-catharsis-of-comms'],
  [43083743, 'the-mandate-of-my-existence'],
];

const sleep = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

async function fetchResponse(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json,text/html,image/avif,image/webp,image/*,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151 Safari/537.36',
        },
        redirect: 'follow',
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(800 * attempt);
    }
  }
  throw new Error(`Unable to fetch ${url}: ${lastError}`);
}

async function fetchJson(url) {
  return (await fetchResponse(url)).json();
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
  return decodeEntities(String(value).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function descriptionFor(post) {
  const text = stripHtml(post.subtitle || post.description || post.truncated_body_text || post.body_html || '');
  if (!text) return 'Imported from Hakan Alpay’s delta galaxy archive.';
  return text.length <= 240 ? text : `${text.slice(0, 237).replace(/\s+\S*$/, '')}…`;
}

function yaml(value) {
  return JSON.stringify(String(value));
}

function extensionFor(contentType) {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  return ({
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/avif': '.avif',
  })[type] || '.jpg';
}

function articleImageUrls(html) {
  const urls = new Set();
  for (const match of String(html).matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)["']/gi)) {
    const url = decodeEntities(match[1]);
    if (/substackcdn\.com\/image\/fetch|substack-post-media\.s3\.amazonaws\.com|bucketeer-[^/]+\.s3\.amazonaws\.com\/public\/images/i.test(url)) {
      urls.add(url);
    }
  }
  return [...urls];
}

async function localizeImages(html, slug) {
  let output = String(html)
    .replace(/\s+srcset=["'][^"']*["']/gi, '')
    .replace(/\s+data-srcset=["'][^"']*["']/gi, '');
  const dir = resolve(imagesRoot, slug);
  await mkdir(dir, { recursive: true });

  let index = 0;
  for (const originalUrl of articleImageUrls(output)) {
    index += 1;
    const response = await fetchResponse(originalUrl);
    const bytes = Buffer.from(await response.arrayBuffer());
    const ext = extensionFor(response.headers.get('content-type'));
    const name = `image-${String(index).padStart(3, '0')}${ext}`;
    await writeFile(resolve(dir, name), bytes);
    const local = `/blog/images/imported/substack/${slug}/${name}`;
    output = output
      .split(originalUrl).join(local)
      .split(originalUrl.replace(/&/g, '&amp;')).join(local);
    console.log(`Saved substack/${slug}/${name}`);
  }
  return output;
}

function frontmatter(post, slug) {
  const canonical = post.canonical_url || `https://deltastar.substack.com/p/${slug}`;
  const tags = (post.postTags || []).map((tag) => tag.name).filter(Boolean).slice(0, 12);
  const lines = [
    '---',
    `title: ${yaml(stripHtml(post.title) || slug)}`,
    `description: ${yaml(descriptionFor(post))}`,
    `published: ${yaml(post.post_date)}`,
  ];
  if (post.updated_at && new Date(post.updated_at).valueOf() > new Date(post.post_date).valueOf() + 60_000) {
    lines.push(`updated: ${yaml(post.updated_at)}`);
  }
  lines.push(`tags: [${tags.map(yaml).join(', ')}]`);
  lines.push('draft: false');
  lines.push('featured: false');
  lines.push(`legacySource: ${yaml(canonical)}`);
  lines.push('---', '');
  return lines.join('\n');
}

await rm(postsDir, { recursive: true, force: true });
await rm(imagesRoot, { recursive: true, force: true });
await mkdir(postsDir, { recursive: true });
await mkdir(imagesRoot, { recursive: true });

const imported = [];
for (const [id, expectedSlug] of POSTS) {
  const raw = await fetchJson(`https://substack.com/api/v1/posts/by-id/${id}`);
  const post = raw.post || raw;
  const slug = post.slug || expectedSlug;
  if (slug !== expectedSlug) throw new Error(`Substack ID ${id} resolved to unexpected slug ${slug}; expected ${expectedSlug}.`);
  if (!post.body_html) throw new Error(`Substack post ${slug} has no body_html.`);

  const localized = await localizeImages(post.body_html, slug);
  const body = localized
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .trim();
  await writeFile(resolve(postsDir, `${slug}.md`), `${frontmatter(post, slug)}<!-- Imported verbatim from ${post.canonical_url || `https://deltastar.substack.com/p/${slug}`}. -->\n\n${body}\n`);
  imported.push(post);
  console.log(`Imported substack: ${post.title}`);
}

if (imported.length !== POSTS.length) throw new Error(`Expected ${POSTS.length} Substack posts; imported ${imported.length}.`);

let wordpressCount = 0;
try {
  wordpressCount = (await readdir(wordpressDir)).filter((name) => name.endsWith('.md')).length;
} catch {
  throw new Error('WordPress import directory is missing; WordPress import must run first.');
}

const report = [
  '# Public archive import',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `- WordPress posts/pages: ${wordpressCount}`,
  `- Substack posts: ${imported.length}`,
  `- Total imported: ${wordpressCount + imported.length}`,
  '',
  'The Substack archive was independently enumerated at 12 public posts before migration. WordPress exposes 19 public posts; Lonely-CLA is imported as a separate page.',
  '',
  '## Substack items',
  '',
  ...imported
    .sort((a, b) => new Date(b.post_date) - new Date(a.post_date))
    .map((post) => `- ${post.post_date.slice(0, 10)} — **${stripHtml(post.title)}** — ${post.canonical_url}`),
  '',
  'Rendered source HTML is retained. Article images are downloaded into `public/images/imported/` and the HTML is rewritten to local `/blog/images/imported/...` URLs. Remote responsive `srcset` variants are removed so browsers cannot silently bypass the local copy.',
  '',
].join('\n');
await writeFile(resolve(root, 'docs/PUBLIC_ARCHIVE_IMPORT.md'), report);

console.log(`Imported ${wordpressCount} WordPress items + ${imported.length} Substack posts.`);
