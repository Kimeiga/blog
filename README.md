# Developer Blog

A sample developer blog built with Astro, featuring a clean, minimalist design with multicolor navigation links inspired by the Almace Scaffolding Jekyll theme.

## Features

- 🎨 **Multicolor Navigation** - Each nav link has its own customizable color
- 📝 **Blog Section** - Technical articles and tutorials
- 💼 **Work Section** - Project portfolio with detailed case studies
- 📱 **Responsive Design** - Looks great on all devices
- ⚡ **Fast Performance** - Built with Astro for optimal speed
- 🎯 **SEO Optimized** - Meta tags, Open Graph, and Twitter Cards
- 🔤 **Beautiful Typography** - Helvetica Neue with careful spacing

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Build

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── Navigation.astro
│   │   └── Footer.astro
│   ├── layouts/         # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── PageLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/           # File-based routing
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── *.md
│   │   └── work/
│   │       ├── index.astro
│   │       └── *.md
│   ├── styles/          # Global styles
│   │   ├── variables.scss
│   │   ├── reset.scss
│   │   ├── common.scss
│   │   └── global.scss
│   └── config.ts        # Site configuration
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Customization

### Site Configuration

Edit `src/config.ts` to customize your site:

```typescript
export const SITE_CONFIG = {
  name: 'Your Name',
  description: 'Your site description',
  url: 'https://yoursite.com',
  author: 'Your Name',
  
  // Customize navigation with colors
  navigation: [
    { title: 'Home', url: '/', color: '#ff00b4' },
    { title: 'Blog', url: '/blog/', color: '#00b4ff' },
    { title: 'Work', url: '/work/', color: '#b4ff00' },
    { title: 'About', url: '/about/', color: '#ff6b00' },
  ],
  
  colors: {
    theme: '#ff00b4',
    background: '#fff',
    text: '#000',
    link: '#ff00b4',
  },
};
```

### Adding Navigation Links

To add or modify navigation links, edit the `navigation` array in `src/config.ts`. Each link can have its own color:

```typescript
navigation: [
  { title: 'Home', url: '/', color: '#ff00b4' },
  { title: 'Projects', url: '/projects/', color: '#00ff00' },
  // Add more links...
]
```

### Styling

Global styles are in `src/styles/`:

- `variables.scss` - CSS variables and breakpoints
- `reset.scss` - CSS reset and base styles
- `common.scss` - Common component styles
- `global.scss` - Imports all style files

To customize colors, fonts, or spacing, edit the CSS variables in `variables.scss`.

## Creating Content

### Blog Posts

Create a new `.md` file in `src/pages/blog/`:

```markdown
---
layout: ../../layouts/PostLayout.astro
title: "Your Post Title"
description: "A brief description"
date: 2025-01-15
author: "Your Name"
---

Your content here...
```

### Work/Projects

Create a new `.md` file in `src/pages/work/`:

```markdown
---
layout: ../../layouts/PostLayout.astro
title: "Project Name"
description: "Project description"
date: 2025-01-15
tech: "Technologies used"
---

Project details...
```

### Pages

Create a new `.astro` file in `src/pages/`:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
---

<PageLayout title="Page Title" subtitle="Optional subtitle">
  <p>Your content here...</p>
</PageLayout>
```

## Deployment

This site can be deployed to any static hosting platform:

### Cloudflare Pages

```bash
npm run build
# Deploy the dist/ directory
```

### Netlify

```bash
npm run build
# Deploy the dist/ directory
```

### Vercel

```bash
npm run build
# Deploy the dist/ directory
```

### GitHub Pages

Add to your `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://username.github.io',
  base: '/repo-name',
});
```

## Sample Content

This blog comes with sample content to help you get started:

### Blog Posts
- Building Scalable APIs with Node.js
- TypeScript Tips for Better Code Quality
- Why I Migrated to Astro for My Blog

### Work Projects
- DevTools CLI
- Real-time Analytics Dashboard
- Microservices API Gateway

Feel free to delete or modify these to create your own content!

## Typography

The theme uses Helvetica Neue with the following features:

- Large, bold navigation links
- Responsive font sizing based on viewport width
- Careful letter spacing for headings
- Optimized line height for readability

## Performance

Built with Astro for optimal performance:

- Zero JavaScript by default
- Optimized images
- Minimal CSS
- Fast page loads

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Credits

Theme inspired by [Almace Scaffolding](https://github.com/sparanoid/almace-scaffolding) Jekyll theme.
Built with [Astro](https://astro.build).

