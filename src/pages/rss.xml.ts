import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { absolute } from '../lib/paths';
import { getPublishedPosts, postUrl } from '../lib/posts';

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char);

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const items = posts.map((post) => `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <description>${escapeXml(post.data.description)}</description>
      <link>${absolute(postUrl(post).replace(/^\/blog/, ''))}</link>
      <guid isPermaLink="true">${absolute(postUrl(post).replace(/^\/blog/, ''))}</guid>
      <pubDate>${post.data.published.toUTCString()}</pubDate>
      ${post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
    </item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeXml(SITE.title)}</title>
      <description>${escapeXml(SITE.description)}</description>
      <link>${absolute('/')}</link>
      <atom:link href="${absolute('/rss.xml')}" rel="self" type="application/rss+xml" />
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
