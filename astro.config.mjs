import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  markdown: {
    shikiConfig: {
      // Use GitHub's polished themes for light/dark mode
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // Wrap code blocks in a div for better styling control
      wrap: false,
    },
  },
});

