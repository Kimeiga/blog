import type { APIRoute } from 'astro';
import { absolute } from '../lib/paths';
import { allTags, getPublishedPosts, postUrl } from '../lib/posts';
const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const staticPaths = ['/', '/archive/', '/tags/', '/search/', '/about/'];
  const urls = [
    ...staticPaths.map((path) => ({ loc: absolute(path), lastmod: posts[0]?.data.updated ?? posts[0]?.data.published })),
    ...posts.map((post) => ({ loc: absolute(postUrl(post).replace(/^\/blog/, '')), lastmod: post.data.updated ?? post.data.published })),
    ...allTags(posts).map((tag) => ({ loc: absolute(`/tags/${tag.slug}/`), lastmod: posts[0]?.data.updated ?? posts[0]?.data.published })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((item) => `<url><loc>${escapeXml(item.loc)}</loc>${item.lastmod ? `<lastmod>${item.lastmod.toISOString()}</lastmod>` : ''}</url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
