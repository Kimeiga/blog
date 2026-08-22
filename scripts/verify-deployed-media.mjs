const requestedRoot = process.argv[2];

if (!requestedRoot) {
  console.error('Usage: node scripts/verify-deployed-media.mjs <site-root>');
  process.exit(1);
}

const root = new URL(requestedRoot.endsWith('/') ? requestedRoot : `${requestedRoot}/`);
const rootOrigin = `${root.protocol}//${root.host}`;

function absoluteOnRequestedHost(value) {
  const source = new URL(value);
  return new URL(`${source.pathname}${source.search}`, rootOrigin).href;
}

function htmlAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? '';
}

function imageUrls(html, pageUrl) {
  const urls = new Set();
  const tags = html.match(/<(?:img|source)\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    const src = htmlAttribute(tag, 'src');
    if (src && !src.startsWith('data:')) urls.add(new URL(src, pageUrl).href);

    const srcset = htmlAttribute(tag, 'srcset');
    for (const candidate of srcset.split(',')) {
      const value = candidate.trim().split(/\s+/)[0];
      if (value && !value.startsWith('data:')) urls.add(new URL(value, pageUrl).href);
    }
  }

  return urls;
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

const sitemapUrl = new URL('sitemap.xml', root).href;
const sitemap = await fetchText(sitemapUrl);
const canonicalUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const articleUrls = canonicalUrls
  .filter((value) => new URL(value).pathname.includes('/posts/'))
  .map(absoluteOnRequestedHost);

if (articleUrls.length === 0) {
  console.error(`No article URLs found in ${sitemapUrl}`);
  process.exit(1);
}

const failures = [];
const mediaToPages = new Map();

for (const pageUrl of articleUrls) {
  try {
    const html = await fetchText(pageUrl);
    for (const mediaUrl of imageUrls(html, pageUrl)) {
      const pages = mediaToPages.get(mediaUrl) ?? [];
      pages.push(pageUrl);
      mediaToPages.set(mediaUrl, pages);
    }
  } catch (error) {
    failures.push(`Article ${pageUrl}: ${error.message}`);
  }
}

const mediaUrls = [...mediaToPages.keys()];
const workerCount = Math.min(16, mediaUrls.length);
let nextIndex = 0;

async function verifyMedia() {
  while (nextIndex < mediaUrls.length) {
    const mediaUrl = mediaUrls[nextIndex++];
    try {
      const response = await fetch(mediaUrl, { redirect: 'follow' });
      const contentType = response.headers.get('content-type') ?? '';
      await response.body?.cancel();

      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      if (!contentType.toLowerCase().startsWith('image/')) {
        throw new Error(`unexpected content-type ${contentType || '(missing)'}`);
      }
    } catch (error) {
      failures.push(`Media ${mediaUrl}: ${error.message}; referenced by ${mediaToPages.get(mediaUrl).join(', ')}`);
    }
  }
}

await Promise.all(Array.from({ length: workerCount }, verifyMedia));

if (failures.length > 0) {
  console.error(`Deployed media verification failed for ${root.href}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Verified ${articleUrls.length} article pages and ${mediaUrls.length} unique image URLs at ${root.href}`);
