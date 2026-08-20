import { mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = new URL('..', import.meta.url).pathname;
const postsDir = join(root, 'src/content/posts/legacy');
const imagesDir = join(root, 'public/images/legacy');
const force = process.argv.includes('--force');
const ifMissing = process.argv.includes('--if-missing');

const sources = [
  { repo: 'blog-old', ref: 'master', path: '_posts/2018-08-01-my-huge-thank-yous.md', slug: 'my-huge-thank-yous', tags: ['Personal', 'Gratitude'] },
  { repo: 'blog-old', ref: 'master', path: '_posts/2018-08-01-why-i-love-youre-welcome.md', slug: 'why-i-love-youre-welcome', tags: ['Music', 'Personal'] },
  { repo: 'blog-old', ref: 'master', path: '_posts/2018-08-01-work-with-hands.md', slug: 'work-with-your-hands', tags: ['Work', 'Making'] },
  { repo: 'blog-old', ref: 'master', path: '_posts/2018-08-08-i-think-too-much.md', slug: 'frankly-i-think-too-much', tags: ['Personal', 'Mind'] },
  { repo: 'blog-old', ref: 'master', path: '_posts/2018-08-23-time-learn-vim.md', slug: 'time-to-learn-vim', tags: ['Software', 'Tools'] },
  { repo: 'blog-old', ref: 'master', path: '_posts/2018-09-03-perfectionism.md', slug: 'perfectionism', tags: ['Personal', 'Making'] },
  { repo: 'blog-old', ref: 'master', path: '_posts/2018-09-11-broken-mechanics.md', slug: 'broken-mechanics', tags: ['Games', 'Design'] },
  { repo: 'blog-old', ref: 'master', path: '_posts/2018-09-15-bahunya.md', slug: 'bahunya-10kb-classless-css-framework', tags: ['Software', 'CSS', 'Open Source'] },
  { repo: 'blog-old', ref: 'master', path: '_posts/2019-12-21-religion.md', slug: 'religion', tags: ['Personal', 'Society'] },
  { repo: 'leetcode', ref: 'main', path: '_posts/2023-09-12-355-design-twitter.md', slug: 'leetcode-355-design-twitter', date: '2023-09-12T12:00:00-04:00', tags: ['Software', 'Algorithms', 'Python'] },
  { repo: 'leetcode', ref: 'main', path: '_posts/2023-09-12-391-perfect-rectangle.md', slug: 'leetcode-391-perfect-rectangle', date: '2023-09-12T13:00:00-04:00', tags: ['Software', 'Algorithms', 'Python'] },
  { repo: 'leetcode', ref: 'main', path: '_posts/2023-09-13-352-data-stream-as-disjoint-intervals.md', slug: 'leetcode-352-data-stream-as-disjoint-intervals', date: '2023-09-13T12:00:00-04:00', tags: ['Software', 'Algorithms', 'Python'] },
];

const exists = async (path) => access(path, constants.F_OK).then(() => true, () => false);
const quote = (value) => JSON.stringify(String(value));
const rawUrl = (source, path = source.path) => `https://raw.githubusercontent.com/Kimeiga/${source.repo}/${source.ref}/${path}`;
const sourceUrl = (source) => `https://github.com/Kimeiga/${source.repo}/blob/${source.ref}/${source.path}`;

function splitFrontmatter(text) {
  const normalized = text.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return match ? { yaml: match[1], body: match[2] } : { yaml: '', body: normalized };
}
function field(yaml, name) {
  const match = yaml.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim().replace(/^['\"]|['\"]$/g, '');
}
function cleanBody(body) {
  return body
    .replace(/\[([^\]]+)]\(\)/g, '[$1]($1)')
    .replace(/<div[^>]*data-track-load="description_content"[^>]*>/g, '')
    .replace(/<\/div>\s*---/g, '\n\n---')
    .trim();
}
function descriptionFrom(body, title) {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[#>*_`{}|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const candidate = text.slice(0, 220).replace(/\s+\S*$/, '').trim();
  return candidate.length >= 30 ? `${candidate}${text.length > candidate.length ? '…' : ''}` : `An archived post by Hakan Alpay: ${title}.`;
}
async function optimizeImage(input, output) {
  try {
    await exec('convert', [input, '-auto-orient', '-resize', '1600x900^', '-gravity', 'center', '-extent', '1600x900', '-strip', '-quality', '82', output]);
    return true;
  } catch {
    return false;
  }
}

await mkdir(postsDir, { recursive: true });
await mkdir(imagesDir, { recursive: true });
if (ifMissing && !force) {
  const allPresent = await Promise.all(sources.map((source) => exists(join(postsDir, `${source.slug}.md`))));
  if (allPresent.every(Boolean)) {
    console.log('Legacy posts already present; skipping sync.');
    process.exit(0);
  }
}

for (const source of sources) {
  const response = await fetch(rawUrl(source), { headers: { 'User-Agent': 'Kimeiga-blog-migrator' } });
  if (!response.ok) throw new Error(`Could not fetch ${source.path}: ${response.status}`);
  const original = await response.text();
  const { yaml, body: rawBody } = splitFrontmatter(original);
  const body = cleanBody(rawBody);
  const title = field(yaml, 'title') ?? basename(source.path, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
  const filenameDate = basename(source.path).slice(0, 10);
  const rawPublished = source.date ?? field(yaml, 'date');
  const published = rawPublished
    ? (/([zZ]|[+-]\d{2}:?\d{2})$/.test(rawPublished)
        ? rawPublished.replace(' ', 'T')
        : `${rawPublished.replace(' ', 'T')}-04:00`)
    : `${filenameDate}T12:00:00-04:00`;
  const imageName = field(yaml, 'image');
  let hero = '';
  if (source.repo === 'blog-old' && imageName) {
    const extension = extname(imageName) || '.jpg';
    const temp = join(imagesDir, `${source.slug}${extension}`);
    const final = join(imagesDir, `${source.slug}.webp`);
    const imageResponse = await fetch(rawUrl(source, `images/${imageName}`), { headers: { 'User-Agent': 'Kimeiga-blog-migrator' } });
    if (imageResponse.ok) {
      await writeFile(temp, Buffer.from(await imageResponse.arrayBuffer()));
      const optimized = await optimizeImage(temp, final);
      if (optimized) await rm(temp, { force: true });
      const publicPath = optimized ? `/images/legacy/${source.slug}.webp` : `/images/legacy/${source.slug}${extension}`;
      hero = `\nhero:\n  src: ${quote(publicPath)}\n  alt: ${quote(`Original image published with “${title}”`)}\n  width: 1600\n  height: 900\n  credit:\n    name: ${quote('Hakan Alpay')}\n    source: ${quote('Original blog archive')}`;
    }
  }
  const frontmatter = `---\ntitle: ${quote(title)}\ndescription: ${quote(descriptionFrom(body, title))}\npublished: ${quote(published)}\ntags: [${source.tags.map(quote).join(', ')}]\ndraft: false\nfeatured: false\nlegacySource: ${quote(sourceUrl(source))}${hero}\n---\n\n`;
  await writeFile(join(postsDir, `${source.slug}.md`), frontmatter + body + '\n');
  console.log(`Imported ${source.repo}/${source.path}`);
}
