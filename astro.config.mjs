import { defineConfig } from 'astro/config';
import { rehypeNormalizeHeadings } from './src/lib/rehype-normalize-headings.mjs';

export default defineConfig({
  site: 'https://hakanalpay.com',
  base: '/blog',
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    rehypePlugins: [rehypeNormalizeHeadings],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
