import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { absolute } from '../lib/paths';
import { getPublishedPosts, plainText, postUrl } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  return new Response(JSON.stringify({
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE.title,
    home_page_url: absolute('/'),
    feed_url: absolute('/feed.json'),
    description: SITE.description,
    authors: [{ name: SITE.author.name, url: SITE.author.url }],
    language: 'en-US',
    items: posts.map((post) => ({
      id: absolute(postUrl(post).replace(/^\/blog/, '')),
      url: absolute(postUrl(post).replace(/^\/blog/, '')),
      title: post.data.title,
      summary: post.data.description,
      content_text: plainText(post.body ?? ''),
      date_published: post.data.published.toISOString(),
      date_modified: (post.data.updated ?? post.data.published).toISOString(),
      tags: post.data.tags,
    })),
  }, null, 2), { headers: { 'Content-Type': 'application/feed+json; charset=utf-8' } });
};
