import { readdir, readFile, access } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsRoot = join(root, 'src/content/posts');
const publicRoot = join(root, 'public');
const errors = [];
const warnings = [];
const canonicalSlugs = new Map();

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (/\.mdx?$/.test(entry.name)) files.push(path);
  }
  return files;
}

const field = (yaml, name) => yaml.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim();
const unquote = (value = '') => value.replace(/^['"]|['"]$/g, '');

for (const file of await walk(postsRoot)) {
  const text = await readFile(file, 'utf8');
  const rel = relative(root, file);
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) { errors.push(`${rel}: missing YAML frontmatter`); continue; }
  const [_, yaml, body] = match;

  const contentId = relative(postsRoot, file).split(sep).join('/').replace(/\.mdx?$/, '');
  const canonicalSlug = contentId
    .replace(/^legacy\//, '')
    .replace(/^imported\/(?:wordpress|substack)\//, '');
  const prior = canonicalSlugs.get(canonicalSlug);
  if (prior) errors.push(`${rel}: canonical slug “${canonicalSlug}” collides with ${prior}`);
  else canonicalSlugs.set(canonicalSlug, rel);

  for (const required of ['title', 'description', 'published', 'tags']) {
    if (!field(yaml, required)) errors.push(`${rel}: missing ${required}`);
  }

  const title = unquote(field(yaml, 'title'));
  const description = unquote(field(yaml, 'description'));
  const disclosure = unquote(field(yaml, 'disclosure'));
  if (title.length > 90) warnings.push(`${rel}: title is ${title.length} characters`);
  if (description.length > 180) warnings.push(`${rel}: description is ${description.length} characters`);
  if (disclosure.length > 160) warnings.push(`${rel}: disclosure is ${disclosure.length} characters; keep it to one line`);

  // Catch local assets wherever content can reference them: hero frontmatter,
  // Markdown images, raw HTML, linked full-size images, data attributes,
  // picture/source elements, and every srcset candidate. Requiring a known
  // image extension avoids treating prose examples as files.
  const localImages = [...new Set(
    [...text.matchAll(/(?<![a-z0-9_-])\/(?:blog\/)?images\/[^\s"'<>()[\]{}]+?\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?[^\s"'<>()[\]{}]*)?(?:#[^\s"'<>()[\]{}]*)?/gi)]
      .map((match) => match[0]),
  )];
  for (const image of localImages) {
    const publicPath = image.split(/[?#]/)[0].replace(/^\/blog/, '').replace(/^\//, '');
    if (publicPath.includes('..')) {
      errors.push(`${rel}: local image path may not traverse directories: ${image}`);
      continue;
    }
    try { await access(join(publicRoot, publicPath)); }
    catch { errors.push(`${rel}: local image does not exist: ${image}`); }
  }

  for (const img of text.matchAll(/<img\b[^>]*>/gi)) {
    const tag = img[0];
    const src = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] || '';
    if (/^\/(?:blog\/)?images\//.test(src)) {
      if (!/\bwidth\s*=\s*["']?\d+/i.test(tag)) errors.push(`${rel}: local <img> lacks width: ${src}`);
      if (!/\bheight\s*=\s*["']?\d+/i.test(tag)) errors.push(`${rel}: local <img> lacks height: ${src}`);
    }
  }

  for (const source of text.matchAll(/<source\b[^>]*>/gi)) {
    const tag = source[0];
    if (/type\s*=\s*["']image\//i.test(tag) && !/\bsrcset\s*=\s*["'][^"']+/i.test(tag)) {
      errors.push(`${rel}: image <source> has no srcset`);
    }
  }

  if (!rel.includes('/legacy/')) {
    const slop = [
      /\bin today['’]s (?:fast-paced|rapidly evolving|digital) (?:world|landscape)\b/i,
      /\bdelve(?:s|d|ing)? into\b/i,
      /\btapestry of\b/i,
      /\bnot just [^.!?]{1,80}, but\b/i,
      /\bit is important to note that\b/i,
      /\bin conclusion\b/i,
      /\b(?:this|the) (?:site|blog|article|post|page) (?:is|was) intentionally\b/i,
      /\bthat distinction matters\b/i,
      /\bmost importantly\b/i,
      /\bwhat (?:I|we) (?:ended up|ultimately) (?:building|doing)\b/i,
    ];
    for (const pattern of slop) {
      if (pattern.test(body)) warnings.push(`${rel}: possible generic or self-explanatory phrasing: ${pattern}`);
    }

    const paragraphs = body.split(/\n\n+/);
    for (const paragraph of paragraphs) {
      const words = paragraph.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      if (words > 170 && !paragraph.startsWith('```')) warnings.push(`${rel}: paragraph has ${words} words`);
    }

    const bodyWords = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const headings = (body.match(/^#{2,3}\s+/gm) ?? []).length;
    if (headings >= 6 && bodyWords / headings < 180) {
      warnings.push(`${rel}: ${headings} section headings across ${bodyWords} words; consider combining sections`);
    }
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}
console.log(`Content validation passed${warnings.length ? ` with ${warnings.length} warning(s)` : ''}.`);
