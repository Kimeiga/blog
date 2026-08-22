import { readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicImages = resolve(root, 'public/images');
const postsRoot = resolve(root, 'src/content/posts');
const imagePattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

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

function value(frontmatter, key) {
  return frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)`, 'm'))?.[1] || '';
}

function cleanBase(name) {
  return name.replace(/\.live\.webp$/i, '').replace(/^source-/, '').replace(/^\w{5}-/, '').replace(extname(name), '').toLowerCase();
}

function markdown(value) {
  return String(value || '—').replaceAll('|', '\\|').replace(/\s+/g, ' ').trim();
}

const postFiles = (await filesUnder(postsRoot)).filter((path) => /\.mdx?$/i.test(path));
const posts = new Map();
for (const path of postFiles) {
  const text = await readFile(path, 'utf8');
  const slug = basename(path).replace(/\.mdx?$/i, '');
  posts.set(slug, {
    text,
    title: value(text, 'title'),
    legacySource: value(text, 'legacySource'),
  });
}

const legacy = {
  'my-huge-thank-yous.webp': ['ucla-view.jpg', 'Hakan Alpay', 'Original post text describes taking the long-exposure UCLA photograph.', 'verified'],
  'why-i-love-youre-welcome.webp': ['trees.jpg', 'Hakan Alpay', 'Original post text says “I managed to catch” the pictured scene.', 'verified'],
  'work-with-your-hands.webp': ['beach.jpg', 'Hakan Alpay', 'Original post ties the photograph to Hakan’s documented trip and activity.', 'verified'],
  'frankly-i-think-too-much.webp': ['robin.jpg', 'Hakan Alpay', 'Original post identifies the scene outside Captain Robin’s house in Hakan’s first-person account.', 'verified'],
  'time-to-learn-vim.webp': ['ucla-view-2.JPG', 'Hakan Alpay', 'Original post calls it “another view”; original EXIF names Artist kimeiga and Copyright 2017.', 'verified'],
  'perfectionism.webp': ['nyc-skyline.jpg', 'Hakan Alpay', 'Original post identifies Hakan’s Empire State Building view; matching Nikon body metadata ties it to the archive set.', 'verified'],
  'broken-mechanics.webp': ['port-authority.jpg', 'Hakan Alpay', 'Original post says “This was taken” and identifies the route and location.', 'verified'],
  'bahunya-10kb-classless-css-framework.webp': ['bahunya.jpg', 'Hakan Alpay', 'Original post explicitly says Hakan made the pictured Bahunya mark.', 'verified'],
  'religion.webp': ['greg.jpg', 'Greg Rakozy', 'Original post caption says “Photo by Greg Rakozy on Unsplash”; exact Unsplash image oMpAz-DN-9I matched.', 'verified'],
};

const wpProbable = new Set(['都', 'aggro-people', 'getting-work-done-while-out', 'meta-for-easy-full-stack-web-app', 'midterms', 'project-grind', 'why-make-a-blog-and-why-blogger', 'yo']);
const substackThirdParty = {
  'how-do-you-stay-focused-when-your': {
    creator: 'Crazy Ivory', source: 'Flickr', sourceUrl: 'https://www.flickr.com/photos/crazy-ivory/5098888565',
    license: 'All rights reserved', licenseUrl: '',
    evidence: 'The original Substack body names Crazy Ivory and the title “sick fearless bastard”; the exact Flickr page confirms the match and rights status.',
    action: 'Original preserved but removed from live HTML; replaced with CC BY-SA photography.',
  },
  'american-urbanism-focuses-too-much': {
    creator: 'NYC Department of Transportation', source: 'NYC Street Design Manual', sourceUrl: 'https://www.nycstreetdesign.info/',
    license: 'Reuse license not established', licenseUrl: '',
    evidence: 'The original Substack alt text identifies the NYC Street Design Manual; the exact official protected-lane image/source was matched.',
    action: 'Original preserved but removed from live HTML; replaced with CC BY-SA Manhattan bicycle-lane photography.',
  },
};

const current = {
  'writing-workflow/hero.webp': ['ai-assisted-writing-worth-reading', 'Clay Banks', 'Unsplash', 'https://unsplash.com/photos/n9AaeihA9HI', 'Unsplash License', 'https://unsplash.com/license'],
  'building-blog/hero.webp': ['building-an-agentic-blog', 'Compagnons', 'Unsplash', 'https://unsplash.com/photos/-7oi_5uJPC4', 'Unsplash License', 'https://unsplash.com/license'],
  'building-blog/code.webp': ['building-an-agentic-blog', 'Hakan Alpay', 'Site source', 'https://github.com/Kimeiga/blog', 'Site-owned screenshot', ''],
};

const rows = [];
const imageFiles = (await filesUnder(publicImages)).filter((path) => imagePattern.test(path)).sort();
for (const path of imageFiles) {
  const local = relative(root, path);
  const rel = relative(publicImages, path);
  const parts = rel.split('/');
  let row = {
    post: '—', local, originalImageUrl: '—', originalPageUrl: '—', creator: '—', source: '—', sourceUrl: '—',
    license: '—', licenseUrl: '—', evidence: '—', confidence: 'unresolved', action: 'Retained pending review.',
  };

  if (parts[0] === 'editorial') {
    const slug = parts[1];
    const meta = JSON.parse(await readFile(resolve(publicImages, 'editorial', slug, 'source.json'), 'utf8'));
    row = {
      ...row, post: `/posts/${slug}/`, originalImageUrl: meta.originalImageUrl, originalPageUrl: posts.get(slug)?.legacySource || `/posts/${slug}/`,
      creator: meta.creator, source: 'Wikimedia Commons', sourceUrl: meta.sourceUrl, license: meta.license, licenseUrl: meta.licenseUrl,
      evidence: 'Wikimedia Commons file page records the creator and reuse license; source binary and derivative metadata are checked in together.',
      confidence: 'verified', action: parts[2] === 'hero.webp' ? '1600 × 900 live derivative with visible credit.' : 'Original licensed download retained.',
    };
  } else if (parts[0] === 'imported' && parts[1] === 'wordpress') {
    const slug = parts[2];
    const post = posts.get(slug) || {};
    const remoteImages = [...(post.text || '').matchAll(/data-orig-file="(https?:[^"?]+)/g)].map((match) => match[1]);
    const fileKey = cleanBase(parts.at(-1));
    const originalImageUrl = remoteImages.find((url) => cleanBase(basename(new URL(url).pathname)).includes(fileKey) || fileKey.includes(cleanBase(basename(new URL(url).pathname)))) || remoteImages[0] || '—';
    row = { ...row, post: `/posts/${slug}/`, originalImageUrl, originalPageUrl: post.legacySource, source: 'WordPress archive', sourceUrl: post.legacySource };
    if (slug === 'lonely-cla') {
      row.creator = 'Hakan Alpay'; row.license = 'Copyright Hakan Alpay'; row.confidence = 'verified';
      row.evidence = 'Original page first-person narrative and linked Google Photos album; original OnePlus timestamps and UCLA GPS form a continuous sequence matching the route.';
      row.action = parts.at(-1).includes('.live.webp') ? 'Optimized live derivative; original preserved with checksum.' : 'Original preserved with checksum.';
    } else if (slug === 'my-tech-setup') {
      row.creator = 'Hakan Alpay'; row.license = 'Copyright Hakan Alpay'; row.confidence = 'verified';
      row.evidence = 'Original file EXIF/IPTC identifies Artist “kimeiga” and Copyright 2017.';
      row.action = parts.at(-1).includes('.live.webp') ? 'Optimized live derivative; original preserved.' : 'Original preserved.';
    } else if (slug === 'japanese-tweet-ex1') {
      row.creator = '@niwakasennpei01'; row.source = 'Twitter/X screenshot'; row.sourceUrl = 'https://x.com/niwakasennpei01'; row.license = 'Reuse license not established'; row.confidence = 'verified';
      row.evidence = 'The creator handle is visible in the screenshot; no exact surviving post URL or reuse license was recovered.';
      row.action = 'Retained as a credited contextual quotation, not decorative photography.';
    } else if (slug === 'i-wish-i-could-go-back-to-coding-for-fun') {
      row.creator = 'Unresolved'; row.source = 'WordPress attachment 81'; row.license = 'Reuse license not established'; row.confidence = 'unresolved';
      row.evidence = 'Original page and WordPress attachment metadata contain no creator, credit, or source; filename and image searches did not establish an exact source.';
      row.action = 'Original preserved but removed from live HTML; replaced with a rights-cleared Smithsonian archive photograph.';
    } else if (wpProbable.has(slug)) {
      row.creator = 'Hakan Alpay'; row.license = 'Presumed site-owned'; row.confidence = 'probable';
      row.evidence = 'Original WordPress placement, first-person context, camera-style filename, and matching archive camera sets support authorship; no explicit credit field was recovered.';
      row.action = parts.at(-1).includes('.live.webp') ? 'Optimized live derivative; no public authorship claim added.' : 'Original preserved; no public authorship claim added.';
    }
  } else if (parts[0] === 'imported' && parts[1] === 'substack') {
    const slug = parts[2];
    const post = posts.get(slug) || {};
    const urls = [...(post.text || '').matchAll(/https:\/\/substack-post-media\.s3\.amazonaws\.com\/public\/images\/[a-z0-9-]+_[^&"<]+/gi)].map((match) => match[0]);
    const third = substackThirdParty[slug];
    row = { ...row, post: `/posts/${slug}/`, originalImageUrl: urls[0] || 'Substack source image retained locally', originalPageUrl: post.legacySource, source: 'delta galaxy', sourceUrl: post.legacySource };
    if (third) {
      Object.assign(row, third, { confidence: 'verified' });
    } else {
      row.creator = 'Hakan Alpay'; row.license = 'Presumed site-owned'; row.confidence = 'probable';
      row.evidence = 'First-party Substack upload and personal/location context support authorship; no embedded credit or contrary source match was found.';
      row.action = parts.at(-1).includes('.live.webp') ? 'Optimized live derivative; no public authorship claim added.' : 'Original Substack variant preserved.';
    }
  } else if (parts[0] === 'legacy' && parts.length === 2 && legacy[parts[1]]) {
    const [original, creator, evidence, confidence] = legacy[parts[1]];
    const slug = parts[1].replace(/\.webp$/, '');
    const post = posts.get(slug) || {};
    row = {
      ...row, post: `/posts/${slug}/`, originalImageUrl: `https://github.com/Kimeiga/blog-old/blob/master/images/${original}`,
      originalPageUrl: post.legacySource, creator, source: 'Life of Kimeiga source repo', sourceUrl: `https://github.com/Kimeiga/blog-old/blob/master/images/${original}`,
      license: creator === 'Greg Rakozy' ? 'Unsplash License' : 'Copyright Hakan Alpay',
      licenseUrl: creator === 'Greg Rakozy' ? 'https://unsplash.com/license' : '', evidence, confidence,
      action: 'Optimized archive derivative retained; visible credit rendered on canonical post.',
    };
  } else if (parts[0] === 'legacy' && parts[1] === 'leetcode-391-perfect-rectangle') {
    const svg = parts.at(-1).endsWith('.svg');
    row = {
      ...row, post: '/posts/leetcode-391-perfect-rectangle/',
      originalImageUrl: svg ? 'Site-authored redraw' : `https://assets.leetcode.com/uploads/2021/03/27/${parts.at(-1)}`,
      originalPageUrl: posts.get('leetcode-391-perfect-rectangle')?.legacySource,
      creator: svg ? 'Hakan Alpay blog migration' : 'LeetCode', source: svg ? 'Canonical blog' : 'LeetCode problem statement',
      sourceUrl: svg ? 'https://github.com/Kimeiga/blog' : 'https://leetcode.com/problems/perfect-rectangle/',
      license: svg ? 'Site-owned redraw' : 'Reuse license not established', licenseUrl: '',
      evidence: svg ? 'New SVG redraw from the numeric example geometry; no LeetCode pixels reused.' : 'Exact asset URL was embedded in the archived LeetCode problem statement.',
      confidence: 'verified', action: svg ? 'Used in live article.' : 'Original preserved for archive evidence but removed from live HTML.',
    };
  } else if (current[rel]) {
    const [slug, creator, source, sourceUrl, license, licenseUrl] = current[rel];
    row = {
      ...row, post: `/posts/${slug}/`, originalImageUrl: sourceUrl, originalPageUrl: `/posts/${slug}/`, creator, source, sourceUrl, license, licenseUrl,
      evidence: 'Checked-in frontmatter/source record identifies the creator and source.', confidence: 'verified', action: 'Used by current canonical post.',
    };
  }
  rows.push(row);
}

const counts = rows.reduce((result, row) => ({ ...result, [row.confidence]: (result[row.confidence] || 0) + 1 }), {});
const lines = [
  '# Image attribution audit', '',
  `Generated: ${new Date().toISOString()}`, '',
  `Files audited: **${rows.length}** · verified: **${counts.verified || 0}** · probable: **${counts.probable || 0}** · unresolved: **${counts.unresolved || 0}**`, '',
  '“Verified” records explicit documentary evidence or an exact source match. “Probable” is retained without a public authorship claim. “Unresolved” media is preserved for archive evidence but not served as an uncredited decorative image.', '',
  '| Canonical post | Local image path | Original image URL | Original page URL | Photographer/creator | Source | Source URL | License | License URL | Evidence used | Confidence | Action taken |',
  '|---|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map((row) => `| ${markdown(row.post)} | \`${markdown(row.local)}\` | ${markdown(row.originalImageUrl)} | ${markdown(row.originalPageUrl)} | ${markdown(row.creator)} | ${markdown(row.source)} | ${markdown(row.sourceUrl)} | ${markdown(row.license)} | ${markdown(row.licenseUrl)} | ${markdown(row.evidence)} | ${row.confidence} | ${markdown(row.action)} |`),
  '',
];
await writeFile(resolve(root, 'docs/IMAGE_ATTRIBUTION_AUDIT.md'), lines.join('\n'));
console.log(`Audited ${rows.length} image files: ${JSON.stringify(counts)}`);
