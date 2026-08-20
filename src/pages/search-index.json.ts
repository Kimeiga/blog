import type { APIRoute } from 'astro';
import { getPublishedPosts, plainText, postUrl } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const payload = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    date: post.data.published.toISOString(),
    url: postUrl(post),
    body: plainText(post.body ?? '').slice(0, 24000),
  }));
  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
