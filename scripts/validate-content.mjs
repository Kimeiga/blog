import { readdir, readFile, access } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const postsRoot = join(root, 'src/content/posts');
const publicRoot = join(root, 'public');
const errors = [];
const warnings = [];

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

  for (const required of ['title', 'description', 'published', 'tags']) {
    if (!field(yaml, required)) errors.push(`${rel}: missing ${required}`);
  }

  const title = unquote(field(yaml, 'title'));
  const description = unquote(field(yaml, 'description'));
  const disclosure = unquote(field(yaml, 'disclosure'));
  if (title.length > 90) warnings.push(`${rel}: title is ${title.length} characters`);
  if (description.length > 180) warnings.push(`${rel}: description is ${description.length} characters`);
  if (disclosure.length > 160) warnings.push(`${rel}: disclosure is ${disclosure.length} characters; keep it to one line`);

  const localImages = [...text.matchAll(/(?:src:\s*|src=["'])(\/images\/[^"'\s]+)/g)].map((m) => m[1]);
  for (const image of localImages) {
    try { await access(join(publicRoot, image)); }
    catch { errors.push(`${rel}: local image does not exist: ${image}`); }
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
