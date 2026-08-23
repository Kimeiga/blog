const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
]);

const HERO_MEDIA_CLASSES = new Set([
  'captioned-image-container',
  'tr-caption-container',
  'wp-caption',
  'wp-block-image',
  'wp-block-jetpack-story',
  'separator',
]);

const CAPTION_CLASSES = new Set([
  'tr-caption',
  'wp-caption-text',
  'image-caption',
  'gallery-caption',
]);

function decodeEntities(value = '') {
  return String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function attribute(source, name) {
  const match = source.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match?.[1] ?? match?.[2] ?? '';
}

function classNames(node) {
  return attribute(node.source, 'class').split(/\s+/).filter(Boolean);
}

function normalizeMediaPath(value) {
  let path = decodeEntities(value).trim();
  if (!path) return '';
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  } catch {
    // Fall through and compare the original path.
  }
  path = path.split(/[?#]/, 1)[0];
  if (path.startsWith('/blog/')) path = path.slice('/blog'.length);
  try { path = decodeURIComponent(path); } catch { /* Keep encoded path. */ }
  return path;
}

function parseHtml(html) {
  const roots = [];
  const stack = [];
  const pattern = /<\/?([A-Za-z][A-Za-z0-9:-]*)\b[^>]*>/g;
  let match;

  while ((match = pattern.exec(html))) {
    const source = match[0];
    const tag = match[1].toLowerCase();
    const closing = source.startsWith('</');

    if (closing) {
      let index = stack.length - 1;
      while (index >= 0 && stack[index].tag !== tag) index -= 1;
      if (index < 0) continue;
      const node = stack[index];
      node.closeStart = match.index;
      node.end = pattern.lastIndex;
      for (let i = index + 1; i < stack.length; i += 1) {
        if (stack[i].end === stack[i].openEnd) {
          stack[i].closeStart = match.index;
          stack[i].end = match.index;
        }
      }
      stack.splice(index);
      continue;
    }

    const parent = stack.at(-1);
    const node = {
      tag,
      source,
      start: match.index,
      openEnd: pattern.lastIndex,
      closeStart: pattern.lastIndex,
      end: pattern.lastIndex,
      parent,
      children: [],
    };
    if (parent) parent.children.push(node);
    else roots.push(node);

    const selfClosing = VOID_TAGS.has(tag) || /\/\s*>$/.test(source);
    if (!selfClosing) stack.push(node);
  }

  for (const node of stack) {
    node.closeStart = html.length;
    node.end = html.length;
  }
  return roots;
}

function flatten(nodes, output = []) {
  for (const node of nodes) {
    output.push(node);
    flatten(node.children, output);
  }
  return output;
}

function usefulCaption(value) {
  const html = String(value || '').trim();
  const text = decodeEntities(html.replace(/<!--[^]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  return text ? html : undefined;
}

function captionHtml(container, html) {
  for (const node of flatten(container.children)) {
    const classes = classNames(node);
    const isCaption = node.tag === 'figcaption' || classes.some((name) => CAPTION_CLASSES.has(name));
    if (!isCaption || node.closeStart < node.openEnd) continue;
    const value = usefulCaption(html.slice(node.openEnd, node.closeStart));
    if (value) return value;
  }

  // Historical HTML is occasionally malformed enough to confuse the lightweight
  // tree above. Fall back to the selected media block itself so captions are not
  // lost when the duplicate body image is removed.
  const fragment = html.slice(container.start, container.end);
  const figcaption = fragment.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1];
  const figcaptionValue = usefulCaption(figcaption);
  if (figcaptionValue) return figcaptionValue;

  const captionElement = /<([A-Za-z][A-Za-z0-9:-]*)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = captionElement.exec(fragment))) {
    const classes = attribute(match[2], 'class').split(/\s+/).filter(Boolean);
    if (!classes.some((name) => CAPTION_CLASSES.has(name))) continue;
    const value = usefulCaption(match[3]);
    if (value) return value;
  }
  return undefined;
}

function mediaPaths(node) {
  const paths = [attribute(node.source, 'src'), attribute(node.source, 'data-src')];
  const srcset = attribute(node.source, 'srcset');
  if (srcset) {
    for (const candidate of srcset.split(',')) paths.push(candidate.trim().split(/\s+/, 1)[0]);
  }
  return paths.map(normalizeMediaPath).filter(Boolean);
}

function mediaContainer(target) {
  let node = target.parent;
  let figure;
  let known;
  while (node) {
    if (!figure && node.tag === 'figure') figure = node;
    if (classNames(node).some((name) => HERO_MEDIA_CLASSES.has(name))) known = node;
    node = node.parent;
  }
  return known ?? figure ?? target;
}

function replaceRanges(value, replacements) {
  let output = value;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    output = `${output.slice(0, replacement.start)}${replacement.value}${output.slice(replacement.end)}`;
  }
  return output;
}

export function normalizeImportedHeadings(html) {
  const headings = flatten(parseHtml(html)).filter((node) => /^h[1-6]$/.test(node.tag));
  const replacements = [];
  let previousDepth = 1;

  for (const heading of headings) {
    const originalDepth = Number(heading.tag.slice(1));
    const depth = Math.min(originalDepth, previousDepth + 1);
    previousDepth = depth;
    if (depth === originalDepth) continue;

    const opening = html.slice(heading.start, heading.openEnd)
      .replace(/^<h[1-6]/i, `<h${depth}`)
      .replace(/>$/, ` data-original-heading="${originalDepth}">`);
    const closing = html.slice(heading.closeStart, heading.end)
      .replace(/^<\/h[1-6]/i, `</h${depth}`);
    replacements.push(
      { start: heading.start, end: heading.openEnd, value: opening },
      { start: heading.closeStart, end: heading.end, value: closing },
    );
  }

  return replaceRanges(html, replacements);
}

export function dedupeImportedHero(html, heroSrc) {
  const heroPath = normalizeMediaPath(heroSrc);
  if (!heroPath || !html) return { html, changed: false };

  const nodes = flatten(parseHtml(html));
  const media = nodes.find((node) =>
    (node.tag === 'img' || node.tag === 'source') && mediaPaths(node).includes(heroPath),
  );
  if (!media) return { html, changed: false };

  const container = mediaContainer(media);
  const extractedCaptionHtml = captionHtml(container, html);
  let before = html.slice(0, container.start);
  let after = html.slice(container.end);

  before = before.replace(/(?:<p\b[^>]*>\s*<\/p>\s*)$/i, '');
  after = after.replace(/^(?:\s*<p\b[^>]*>\s*<\/p>)+/i, '');

  return {
    html: normalizeImportedHeadings(`${before}${after}`),
    changed: true,
    captionHtml: extractedCaptionHtml,
  };
}
