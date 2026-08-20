import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const tmpDir = resolve(root, '.image-import');

const images = [
  {
    source: 'https://unsplash.com/photos/-7oi_5uJPC4/download?force=true',
    destination: 'public/images/building-blog/hero.webp',
  },
  {
    source: 'https://unsplash.com/photos/9-U8xW54Le0/download?force=true',
    destination: 'public/images/building-blog/code.webp',
  },
  {
    source: 'https://unsplash.com/photos/lbfd7zw0LTk/download?force=true',
    destination: 'public/images/building-blog/editorial-layout.webp',
  },
  {
    source: 'https://unsplash.com/photos/n9AaeihA9HI/download?force=true',
    destination: 'public/images/writing-workflow/hero.webp',
  },
  {
    source: 'https://unsplash.com/photos/hBdaqrr5Z3k/download?force=true',
    destination: 'public/images/writing-workflow/notes.webp',
  },
];

await mkdir(tmpDir, { recursive: true });

try {
  for (const [index, image] of images.entries()) {
    const destination = resolve(root, image.destination);
    await mkdir(dirname(destination), { recursive: true });

    const response = await fetch(image.source, {
      headers: { 'User-Agent': 'Hakan-Alpay-Blog/1.0 (+https://hakanalpay.com/blog)' },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch ${image.source}: ${response.status} ${response.statusText}`);
    }

    const input = resolve(tmpDir, `${index}.jpg`);
    await writeFile(input, Buffer.from(await response.arrayBuffer()));

    execFileSync('convert', [
      input,
      '-auto-orient',
      '-resize',
      '1600x900^',
      '-gravity',
      'center',
      '-extent',
      '1600x900',
      '-strip',
      '-quality',
      '82',
      destination,
    ], { stdio: 'inherit' });

    console.log(`Wrote ${image.destination}`);
  }
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}
