import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = resolve(root, 'src/content/posts/imported/substack');
const imagesRoot = resolve(root, 'public/images/imported/substack');
const wordpressDir = resolve(root, 'src/content/posts/imported/wordpress');

// Verified against https://deltastar.substack.com/archive?sort=new on 2026-08-22.
// The publication has 14 public archive entries. Numeric IDs let this importer use
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
  [43082302, 'the-love-of-language-and-the-language'],
  [43080730, 'the-supreme-lack-of-meaning-in-life'],
];

const HEROES = {
  'in-life-there-is-rain': {
    src: '/images/editorial/in-life-there-is-rain/hero.webp',
    alt: 'Pedestrians and cars on a rain-soaked Manhattan street at dusk.',
    name: 'Tony Hisgett',
    url: 'https://www.flickr.com/people/hisgett/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:New_York_Rain_3_(4669030741).jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    objectPosition: 'center 58%',
  },
  'yerkes-dodson-law': {
    src: '/images/editorial/yerkes-dodson-law/hero.webp',
    alt: 'Psychologist Robert Yerkes seated at his desk at Harvard University.',
    name: 'Unknown photographer',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Robert-Yerkes.jpg',
    license: 'Public domain (US)',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    objectPosition: 'center 35%',
  },
  'on-the-benign-unprovability-of-our': {
    src: '/images/editorial/on-the-benign-unprovability-of-our/hero.webp',
    alt: 'Close photograph of a human eye and iris.',
    name: 'Kookaaa',
    url: 'https://commons.wikimedia.org/wiki/User:Kookaaa',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Close_up_shot_of_the_human_eye,_9_August_2024.jpg',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'on-the-unprovability-of-our-perception': {
    src: '/images/editorial/on-the-unprovability-of-our-perception/hero.webp',
    alt: 'William Henry Fox Talbot’s early photograph of a camera obscura.',
    name: 'William Henry Fox Talbot',
    url: 'https://www.metmuseum.org/art/collection/search/289224',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Camera_Obscura_MET_DP202274.jpg',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
};

const INLINE_REPLACEMENTS = {
  'how-do-you-stay-focused-when-your': '<figure class="replacement-image"><img src="/blog/images/editorial/how-do-you-stay-focused-when-your/hero.webp" width="1600" height="900" alt="A long-haired ginger cat perched on a balcony wall." loading="eager" fetchpriority="high"><figcaption>Replacement for an archived source image. Photo by <a href="https://www.flickr.com/people/34707874@N03">Filippo Salamone</a> on <a href="https://commons.wikimedia.org/wiki/File:Cat_on_balcony.jpg">Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a></figcaption></figure>',
  'american-urbanism-focuses-too-much': '<figure class="replacement-image"><img src="/blog/images/editorial/american-urbanism-focuses-too-much/hero.webp" width="1600" height="900" alt="The green bicycle lane on Eighth Avenue at West 56th Street in Manhattan." loading="eager" fetchpriority="high"><figcaption>lovely bollard-separated two way bikelane on a street in NYC that doesn’t have enough traffic to need a bus lane I guess<br>Photo by <a href="https://commons.wikimedia.org/wiki/User:Tdorante10">Tdorante10</a> on <a href="https://commons.wikimedia.org/wiki/File:W_56th_St_8th_Av_03.jpg">Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></figcaption></figure>',
};

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
  const hero = HEROES[slug];
  if (hero) {
    lines.push('hero:');
    lines.push(`  src: ${yaml(hero.src)}`);
    lines.push(`  alt: ${yaml(hero.alt)}`);
    lines.push('  width: 1600');
    lines.push('  height: 900');
    lines.push('  credit:');
    lines.push(`    name: ${yaml(hero.name)}`);
    if (hero.url) lines.push(`    url: ${yaml(hero.url)}`);
    lines.push('    source: "Wikimedia Commons"');
    lines.push(`    sourceUrl: ${yaml(hero.sourceUrl)}`);
    lines.push(`    license: ${yaml(hero.license)}`);
    lines.push(`    licenseUrl: ${yaml(hero.licenseUrl)}`);
    if (hero.objectPosition) lines.push(`  objectPosition: ${yaml(hero.objectPosition)}`);
  }
  lines.push(`legacySource: ${yaml(canonical)}`);
  lines.push('---', '');
  return lines.join('\n');
}

const archivePosts = [];
for (let offset = 0; ; offset += 12) {
  const page = await fetchJson(`https://deltastar.substack.com/api/v1/archive?sort=new&search=&offset=${offset}&limit=12`);
  if (!Array.isArray(page)) throw new Error('Substack archive API returned an unexpected response.');
  archivePosts.push(...page);
  if (page.length < 12) break;
}

const expectedBySlug = new Map(POSTS.map(([id, slug]) => [slug, id]));
const archiveBySlug = new Map(archivePosts.map((post) => [post.slug, post.id]));
const absentFromImporter = [...archiveBySlug.keys()].filter((slug) => !expectedBySlug.has(slug));
const absentFromArchive = [...expectedBySlug.keys()].filter((slug) => !archiveBySlug.has(slug));
const mismatchedIds = [...archiveBySlug].filter(([slug, id]) => expectedBySlug.has(slug) && expectedBySlug.get(slug) !== id);
if (archivePosts.length !== POSTS.length || absentFromImporter.length || absentFromArchive.length || mismatchedIds.length) {
  throw new Error([
    `Substack archive/importer mismatch: archive=${archivePosts.length}, importer=${POSTS.length}.`,
    absentFromImporter.length ? `Missing from importer: ${absentFromImporter.join(', ')}.` : '',
    absentFromArchive.length ? `Missing from archive: ${absentFromArchive.join(', ')}.` : '',
    mismatchedIds.length ? `ID mismatch: ${mismatchedIds.map(([slug, id]) => `${slug}=${id}`).join(', ')}.` : '',
  ].filter(Boolean).join(' '));
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
  let body = localized
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .trim();
  if (INLINE_REPLACEMENTS[slug]) {
    body = body.replace(/<div class="captioned-image-container"><figure>[\s\S]*?<\/figure><\/div>/i, INLINE_REPLACEMENTS[slug]);
  }
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

console.log(`Imported ${wordpressCount} WordPress items + ${imported.length} Substack posts.`);
