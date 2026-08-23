import { mkdir, readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const reports = join(root, '.lighthouse');
const origin = process.env.LIGHTHOUSE_ORIGIN ?? 'http://127.0.0.1:4321';
const base = '/blog';
const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
const lighthouse = join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'lighthouse.cmd' : 'lighthouse');
const astro = join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'astro.cmd' : 'astro');
const maxAttempts = 3;
let preview;

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.name === 'index.html') files.push(path);
  }
  return files;
}

function routeFor(file) {
  const path = relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '');
  return `${base}/${path}`.replace(/\/{2,}/g, '/');
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`${command} exited ${code}\n${stdout}\n${stderr}`)));
  });
}

async function ensurePreview() {
  try {
    const response = await fetch(new URL(`${base}/`, origin));
    if (response.ok) return;
  } catch {
    // Start the production preview below.
  }

  const url = new URL(origin);
  preview = spawn(astro, ['preview', '--host', url.hostname, '--port', url.port || '4321'], {
    cwd: root,
    stdio: 'ignore',
  });
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (preview.exitCode !== null) throw new Error(`Astro preview exited with code ${preview.exitCode}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
    try {
      const response = await fetch(new URL(`${base}/`, origin));
      if (response.ok) return;
    } catch {
      // Keep waiting until the preview is accepting requests.
    }
  }
  throw new Error(`Timed out waiting for ${origin}`);
}

process.on('exit', () => preview?.kill());
process.on('SIGINT', () => {
  preview?.kill();
  process.exit(130);
});

await mkdir(reports, { recursive: true });
await ensurePreview();
const routes = (await walk(dist)).map(routeFor).sort();
if (!routes.length) throw new Error('No generated HTML routes found.');

const failures = [];
for (const [index, route] of routes.entries()) {
  const safe = route === `${base}/` ? 'home' : route.slice(base.length + 1).replace(/\/$/, '').replace(/[^a-z0-9]+/gi, '-');
  const output = join(reports, `${String(index + 1).padStart(2, '0')}-${safe}.json`);
  const url = new URL(route, origin).toString();
  console.log(`[${index + 1}/${routes.length}] ${url}`);
  let scores;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    await run(lighthouse, [
      url,
      '--quiet',
      '--output=json',
      `--output-path=${output}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
    ]);
    const report = JSON.parse(await (await import('node:fs/promises')).readFile(output, 'utf8'));
    scores = Object.fromEntries(categories.map((category) => [category, Math.round((report.categories?.[category]?.score ?? 0) * 100)]));
    console.log(`  ${Object.entries(scores).map(([name, score]) => `${name}=${score}`).join(' ')}${attempt > 1 ? ` (attempt ${attempt})` : ''}`);
    const deterministicCategoriesPass = categories
      .filter((category) => category !== 'performance')
      .every((category) => scores[category] === 100);
    if (scores.performance === 100 || !deterministicCategoriesPass || attempt === maxAttempts) break;
    console.log('  retrying performance to exclude lab variance');
  }
  for (const category of categories) {
    if (scores[category] !== 100) failures.push(`${route}: ${category}=${scores[category]}`);
  }
}

if (failures.length) {
  console.error('\nLighthouse contract failed:\n' + failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}
console.log(`\nAll ${routes.length} generated HTML pages scored 100 in all four Lighthouse categories.`);
