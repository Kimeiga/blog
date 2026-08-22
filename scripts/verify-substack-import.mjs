import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const expected = [
  [198800519, 'in-life-there-is-rain'], [168033991, 'yerkes-dodson-law'],
  [157747890, 'on-the-benign-unprovability-of-our'], [157272287, 'american-urbanism-focuses-too-much'],
  [149212832, 'on-the-unprovability-of-our-perception'], [148002077, 'how-do-you-stay-focused-when-your'],
  [50352471, 'stuck-on-repeat'], [43143079, 'code-flow'], [43086863, 'thoughts-and-the-loneliness-that'],
  [43085243, 'how-much-will-we-let-identity-matter'], [43084478, 'the-catharsis-of-comms'],
  [43083743, 'the-mandate-of-my-existence'], [43082302, 'the-love-of-language-and-the-language'],
  [43080730, 'the-supreme-lack-of-meaning-in-life'],
];
const replaced = new Set(['american-urbanism-focuses-too-much', 'how-do-you-stay-focused-when-your']);

async function json(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 HakanBlogArchive/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}
function entities(text) {
  return text.replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
function text(html) { return entities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(); }
function withoutFigure(html, local) {
  if (local) return html.replace(/<figure class="replacement-image">[\s\S]*?<\/figure>/i, '');
  return html.replace(/<div class="captioned-image-container"><figure>[\s\S]*?<\/figure><\/div>/i, '');
}

const archive = [];
for (let offset = 0; ; offset += 12) {
  const page = await json(`https://deltastar.substack.com/api/v1/archive?sort=new&search=&offset=${offset}&limit=12`);
  archive.push(...page);
  if (page.length < 12) break;
}
const expectedMap = new Map(expected.map(([id, slug]) => [slug, id]));
if (archive.length !== expected.length || archive.some((post) => expectedMap.get(post.slug) !== post.id)) {
  throw new Error(`Archive mismatch: live=${archive.length}, expected=${expected.length}`);
}

const rows = [];
for (const [id, slug] of expected) {
  const source = (await json(`https://substack.com/api/v1/posts/by-id/${id}`)).post;
  const local = await readFile(resolve(root, 'src/content/posts/imported/substack', `${slug}.md`), 'utf8');
  const frontmatter = local.match(/^---\n([\s\S]*?)\n---\n/)?.[1] || '';
  const localBody = local.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^<!--[^\n]+-->\s*/, '');
  const localTitle = JSON.parse(frontmatter.match(/^title:\s*(.+)$/m)?.[1] || '""');
  const localDate = JSON.parse(frontmatter.match(/^published:\s*(.+)$/m)?.[1] || '""');
  const sourceBody = replaced.has(slug) ? withoutFigure(source.body_html, false) : source.body_html;
  const comparedLocalBody = replaced.has(slug) ? withoutFigure(localBody, true) : localBody;
  const sourceText = text(sourceBody);
  const localText = text(comparedLocalBody);
  const sourceImages = (source.body_html.match(/<img\b/gi) || []).length;
  const localImages = (localBody.match(/<img\b/gi) || []).length;
  const sourceHeadings = (source.body_html.match(/<h[1-6]\b/gi) || []).length;
  const localHeadings = (localBody.match(/<h[1-6]\b/gi) || []).length;
  if (localTitle !== text(source.title) || localDate !== source.post_date || sourceText !== localText || sourceImages !== localImages || sourceHeadings !== localHeadings) {
    throw new Error(`${slug}: completeness mismatch title=${localTitle === text(source.title)} date=${localDate === source.post_date} text=${sourceText.length}/${localText.length} images=${sourceImages}/${localImages} headings=${sourceHeadings}/${localHeadings}`);
  }
  rows.push({ date: source.post_date.slice(0, 10), title: text(source.title), slug, words: sourceText.split(/\s+/).filter(Boolean).length, images: sourceImages, headings: sourceHeadings });
}

const report = [
  '# Substack import verification', '', `Verified: ${new Date().toISOString()}`, '',
  `Live archive entries: **${archive.length}** · imported entries: **${rows.length}**`, '',
  'Titles and publication timestamps match exactly. After excluding the two intentionally replaced image figures, normalized body text matches exactly. Body image and heading counts match for every post.', '',
  '| Date | Title | Slug | Words | Images | Headings |', '|---|---|---|---:|---:|---:|',
  ...rows.map((row) => `| ${row.date} | ${row.title.replaceAll('|', '\\|')} | ${row.slug} | ${row.words} | ${row.images} | ${row.headings} |`), '',
].join('\n');
await writeFile(resolve(root, 'docs/SUBSTACK_IMPORT_VERIFICATION.md'), report);
console.log(`Verified ${rows.length}/${archive.length} complete Substack posts.`);
