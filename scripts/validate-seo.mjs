import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const publicRoot = join(root, 'public');
const siteOrigin = 'https://hakanalpay.com';
const blogRoot = `${siteOrigin}/blog/`;
const errors = [];
const canonicals = new Map();

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([:\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1].toLowerCase(), match[2] ?? match[3] ?? '']));
}

function decode(value = '') {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function metadata(html) {
  const meta = new Map();
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attr = attributes(tag);
    const key = (attr.name ?? attr.property)?.toLowerCase();
    if (key && !meta.has(key)) meta.set(key, decode(attr.content));
  }
  return meta;
}

function link(html, rel) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attr = attributes(tag);
    if ((attr.rel ?? '').split(/\s+/).includes(rel)) return decode(attr.href);
  }
}

const files = (await walk(dist)).sort();
for (const file of files) {
  const rel = relative(dist, file).replace(/\\/g, '/');
  const html = await readFile(file, 'utf8');
  const is404 = rel === '404.html';
  const meta = metadata(html);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim());
  const canonical = link(html, 'canonical');
  const lang = attributes(html.match(/<html\b[^>]*>/i)?.[0] ?? '').lang;
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  if (!title) errors.push(`${rel}: missing title`);
  if (!meta.get('description')) errors.push(`${rel}: missing meta description`);
  if (!meta.get('author')) errors.push(`${rel}: missing author metadata`);
  if (!canonical?.startsWith(blogRoot)) errors.push(`${rel}: invalid canonical URL: ${canonical ?? 'missing'}`);
  if (!lang) errors.push(`${rel}: missing html lang`);
  if (h1Count < 1) errors.push(`${rel}: missing h1`);

  const robots = meta.get('robots') ?? '';
  if (is404) {
    if (!robots.includes('noindex')) errors.push(`${rel}: 404 must be noindex`);
  } else {
    if (!robots.includes('index') || !robots.includes('max-image-preview:large')) errors.push(`${rel}: incomplete robots directives`);
    const prior = canonical && canonicals.get(canonical);
    if (prior) errors.push(`${rel}: canonical duplicates ${prior}`);
    else if (canonical) canonicals.set(canonical, rel);
  }

  const required = [
    'og:type', 'og:site_name', 'og:locale', 'og:title', 'og:description', 'og:url',
    'og:image', 'og:image:secure_url', 'og:image:type', 'og:image:width', 'og:image:height', 'og:image:alt',
    'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt',
  ];
  for (const key of required) if (!meta.get(key)) errors.push(`${rel}: missing ${key}`);
  if (meta.get('og:url') !== canonical) errors.push(`${rel}: og:url does not match canonical`);
  if (meta.get('og:image') !== meta.get('twitter:image')) errors.push(`${rel}: Open Graph and Twitter images differ`);

  const image = meta.get('og:image');
  if (image?.startsWith(`${siteOrigin}/blog/`)) {
    const path = decodeURIComponent(new URL(image).pathname.replace(/^\/blog\//, ''));
    try { await access(join(publicRoot, path)); }
    catch { errors.push(`${rel}: social image does not exist: ${image}`); }
  }

  const jsonLd = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  if (jsonLd.length !== 1) errors.push(`${rel}: expected one JSON-LD graph, found ${jsonLd.length}`);
  else {
    try {
      const data = JSON.parse(jsonLd[0][1]);
      const types = (data['@graph'] ?? []).map((item) => item['@type']);
      if (data['@context'] !== 'https://schema.org' || !types.includes('Person') || !types.includes('WebSite') || !types.includes('Blog')) {
        errors.push(`${rel}: incomplete structured-data graph`);
      }
      if (meta.get('og:type') === 'article' && !types.includes('BlogPosting')) errors.push(`${rel}: article lacks BlogPosting data`);
    } catch (error) {
      errors.push(`${rel}: invalid JSON-LD: ${error.message}`);
    }
  }
}

const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
for (const [canonical, rel] of canonicals) {
  if (!sitemap.includes(`<loc>${canonical.replace(/&/g, '&amp;')}</loc>`)) errors.push(`${rel}: canonical missing from sitemap`);
}
const robotsText = await readFile(join(dist, 'robots.txt'), 'utf8');
if (!robotsText.includes(`Sitemap: ${blogRoot}sitemap.xml`)) errors.push('robots.txt: missing canonical sitemap URL');

if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${files.length} generated HTML page(s), including ${canonicals.size} indexable canonical URL(s).`);
