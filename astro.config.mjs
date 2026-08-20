import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hakanalpay.com',
  base: '/blog',
  output: 'static',
  trailingSlash: 'always',
  markdown: {
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
