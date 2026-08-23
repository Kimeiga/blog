import { mkdir, readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsRoot = join(root, 'src/content/posts');
const publicRoot = join(root, 'public');
const outputRoot = join(publicRoot, 'images/responsive');
const widths = [480, 720, 960];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (/\.mdx?$/.test(entry.name)) files.push(path);
  }
  return files;
}

function postSlug(file) {
  return relative(postsRoot, file)
    .split(sep).join('/')
    .replace(/\.mdx?$/, '')
    .replace(/^legacy\//, '')
    .replace(/^imported\/(?:wordpress|substack)\//, '');
}

function imageKey(slug) {
  return slug.replace(/[^a-z0-9_-]/gi, (character) => `-${character.codePointAt(0).toString(16)}-`);
}

await mkdir(outputRoot, { recursive: true });
let generated = 0;

for (const file of await walk(postsRoot)) {
  const text = await readFile(file, 'utf8');
  const hero = text.match(/^hero:\n((?: {2}.+\n?)+)/m)?.[1];
  if (!hero) continue;

  const sourceUrl = hero.match(/^ {2}src:\s*["']([^"']+)["']/m)?.[1];
  const declaredWidth = Number(hero.match(/^ {2}width:\s*(\d+)/m)?.[1]);
  const declaredHeight = Number(hero.match(/^ {2}height:\s*(\d+)/m)?.[1]);
  if (!sourceUrl || !declaredWidth || !declaredHeight) throw new Error(`Incomplete hero metadata in ${relative(root, file)}`);

  const source = join(publicRoot, sourceUrl.replace(/^\/blog/, '').replace(/^\//, ''));
  const metadata = await sharp(source, { animated: false }).metadata();
  if (metadata.width !== declaredWidth || metadata.height !== declaredHeight) {
    throw new Error(
      `Hero dimensions in ${relative(root, file)} are ${declaredWidth}×${declaredHeight}; ` +
      `the image is ${metadata.width}×${metadata.height}`,
    );
  }
  const key = imageKey(postSlug(file));
  for (const width of widths.filter((candidate) => candidate < declaredWidth)) {
    const output = join(outputRoot, `${key}-${width}.webp`);
    await sharp(source, { animated: false })
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 74, effort: 5, smartSubsample: true })
      .toFile(output);
    generated += 1;
  }
}

console.log(`Generated ${generated} responsive post image derivative(s).`);
