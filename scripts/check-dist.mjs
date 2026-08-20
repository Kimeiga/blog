import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist', import.meta.url).pathname;
const problems = [];

async function walk(directory) {
  for (const name of await readdir(directory)) {
    const path = join(directory, name);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    else if (name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      for (const match of html.matchAll(/(?:href|src)=["'](\/[^"']*)["']/g)) {
        const url = match[1];
        if (!url.startsWith('/blog/') && url !== '/blog' && !url.startsWith('//')) {
          problems.push(`${relative(root, path)}: root-relative URL escapes /blog: ${url}`);
        }
      }
    }
  }
}

await walk(root);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('Generated HTML keeps all local root-relative URLs under /blog.');
