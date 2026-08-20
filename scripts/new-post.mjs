import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const [title, requestedSlug] = process.argv.slice(2);
if (!title) {
  console.error('Usage: npm run new -- "Post title" [optional-slug]');
  process.exit(1);
}
const slug = (requestedSlug ?? title)
  .normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const path = join(root, 'src/content/posts', `${slug}.md`);
try { await access(path, constants.F_OK); console.error(`${path} already exists`); process.exit(1); } catch {}
await mkdir(join(root, 'src/content/posts'), { recursive: true });
const now = new Date().toISOString();
const content = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify('Replace this with a concrete one-sentence description before publishing.')}\npublished: ${JSON.stringify(now)}\ntags: [Draft]\ndraft: true\nfeatured: false\n---\n\nWrite the opening from a concrete observation, tension, or question—not a summary of the article.\n`;
await writeFile(path, content);
console.log(`Created ${path}`);
