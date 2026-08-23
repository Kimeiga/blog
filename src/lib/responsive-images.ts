import type { Post } from './posts';
import { postSlug } from './posts';
import { withBase } from './paths';

const widths = [480, 720, 960];

function imageKey(post: Pick<Post, 'id'>): string {
  return postSlug(post).replace(/[^a-z0-9_-]/gi, (character) => `-${character.codePointAt(0)?.toString(16)}-`);
}

export function responsivePostImage(post: Post) {
  const hero = post.data.hero;
  if (!hero) return undefined;

  const candidates = widths
    .filter((width) => width < hero.width)
    .map((width) => ({ src: `/images/responsive/${imageKey(post)}-${width}.webp`, width }));
  candidates.push({ src: hero.src, width: hero.width });

  const unique = [...new Map(candidates.map((candidate) => [candidate.width, candidate])).values()]
    .sort((a, b) => a.width - b.width);
  const fallback = [...unique].reverse().find((candidate) => candidate.width <= 960) ?? unique.at(-1)!;

  return {
    src: fallback.src,
    srcset: unique.map((candidate) => `${withBase(candidate.src)} ${candidate.width}w`).join(', '),
  };
}
