import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const tmpDir = resolve(root, '.image-import');

// Use Unsplash's image CDN directly. The old /download?force=true page URLs
// began returning 401 in CI and left valid <img> tags pointing at files that
// had never been created.
const images = [
  {
    source: 'https://images.unsplash.com/photo-1776278806688-64ef6a7e2cc5?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    destination: 'public/images/building-blog/hero.webp',
  },
  {
    source: 'https://images.unsplash.com/photo-1774901128215-3549cc686921?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    destination: 'public/images/building-blog/code.webp',
  },
  {
    source: 'https://images.unsplash.com/photo-1761322572550-967ea8c0bfd9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    destination: 'public/images/writing-workflow/hero.webp',
  },
];

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Hakan-Alpay-Blog/1.0 (+https://hakanalpay.com/blog)' },
        redirect: 'follow',
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 1000));
    }
  }
  throw new Error(`Unable to fetch ${url}: ${lastError}`);
}

await mkdir(tmpDir, { recursive: true });

try {
  for (const [index, image] of images.entries()) {
    const destination = resolve(root, image.destination);
    await mkdir(dirname(destination), { recursive: true });

    const input = resolve(tmpDir, `${index}.jpg`);
    await writeFile(input, await fetchWithRetry(image.source));

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
