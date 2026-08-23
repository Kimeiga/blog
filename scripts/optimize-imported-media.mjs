import { execFileSync } from 'node:child_process';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const postsRoot = resolve(root, 'src/content/posts/imported');
const publicRoot = resolve(root, 'public');

async function filesUnder(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else files.push(path);
  }
  return files;
}

function derivativeUrl(sourceUrl) {
  const clean = sourceUrl.split('?')[0];
  return `${clean.slice(0, -extname(clean).length)}.live.webp`;
}

const postFiles = (await filesUnder(postsRoot)).filter((path) => /\.mdx?$/i.test(path));
const generated = new Set();
let rewrittenTags = 0;

for (const postPath of postFiles) {
  let body = await readFile(postPath, 'utf8');
  const tags = [...body.matchAll(/<img\b[^>]*\bsrc=(['"])(\/blog\/images\/imported\/[^'"]+)\1[^>]*>/gi)];

  for (const match of tags) {
    const originalTag = match[0];
    const sourceUrl = match[2];
    if (/\.live\.webp(?:\?|$)/i.test(sourceUrl)) continue;
    const liveUrl = derivativeUrl(sourceUrl);
    const sourcePath = resolve(publicRoot, sourceUrl.replace(/^\/blog\//, '').split('?')[0]);
    const livePath = resolve(publicRoot, liveUrl.replace(/^\/blog\//, ''));

    let liveExists = true;
    try { await access(livePath); } catch { liveExists = false; }
    if (!generated.has(livePath) && !liveExists) {
      await mkdir(dirname(livePath), { recursive: true });
      const galleryPhoto = sourceUrl.includes('/wordpress/lonely-cla/');
      execFileSync('magick', [
        sourcePath,
        '-auto-orient',
        '-resize', galleryPhoto ? '768x768>' : '1600x1600>',
        '-strip',
        '-quality', galleryPhoto ? '76' : '82',
        livePath,
      ]);
      generated.add(livePath);
      console.log(`Generated ${liveUrl}`);
    }

    const [width, height] = execFileSync('magick', ['identify', '-format', '%w %h', livePath], { encoding: 'utf8' })
      .trim().split(/\s+/);
    let liveTag = originalTag.replace(/\bsrc=(['"])[^'"]+\1/i, `src="${liveUrl}"`);
    liveTag = liveTag.replace(/\bdata-large-file=(['"])[^'"]+\.live\.webp\1/i, `data-large-file="${sourceUrl}"`);
    if (!/\bwidth=(['"])/i.test(liveTag)) liveTag = liveTag.replace('<img', `<img width="${width}"`);
    if (!/\bheight=(['"])/i.test(liveTag)) liveTag = liveTag.replace('<img', `<img height="${height}"`);
    if (!/\bloading=(['"])/i.test(liveTag) && !/\bfetchpriority=(['"])high\1/i.test(liveTag)) {
      liveTag = liveTag.replace('<img', '<img loading="lazy"');
    }
    body = body.replace(originalTag, liveTag);
    rewrittenTags += 1;
  }

  body = body.replace(
    /<picture><source([^>]*)><img([^>]*\bsrc="([^"]+\.live\.webp)"[^>]*)>/gi,
    (_whole, sourceAttrs, imageAttrs, liveUrl) => `<picture><source${sourceAttrs.replace(/\s+srcset="[^"]*"/i, '')} srcset="${liveUrl}"><img${imageAttrs}>`,
  );
  await writeFile(postPath, body);
}

console.log(`Generated ${generated.size} live derivatives and rewrote ${rewrittenTags} image tags.`);
