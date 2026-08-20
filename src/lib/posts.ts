import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './paths';

export type Post = CollectionEntry<'posts'>;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  return posts.sort((a, b) => {
    const delta = b.data.published.valueOf() - a.data.published.valueOf();
    return delta || a.id.localeCompare(b.id);
  });
}

export function postSlug(post: Pick<Post, 'id'>): string {
  return post.id.replace(/^legacy\//, '');
}

export function postUrl(post: Pick<Post, 'id'>): string {
  return withBase(`/posts/${postSlug(post)}/`);
}

export function slugifyTag(tag: string): string {
  return tag
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function tagUrl(tag: string): string {
  return withBase(`/tags/${slugifyTag(tag)}/`);
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(date);
}

export function readingTime(body: string): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`\[\](){}|~-]/g, ' ');
  const words = prose.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function allTags(posts: Post[]) {
  const map = new Map<string, { label: string; count: number }>();
  for (const post of posts) {
    for (const label of post.data.tags) {
      const slug = slugifyTag(label);
      const current = map.get(slug);
      map.set(slug, { label: current?.label ?? label, count: (current?.count ?? 0) + 1 });
    }
  }
  return [...map.entries()]
    .map(([slug, value]) => ({ slug, ...value }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_{}|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
