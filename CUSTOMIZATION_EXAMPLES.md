# Customization Examples

This guide shows you how to customize various aspects of your blog with real examples.

## Navigation Color Schemes

### Vibrant Rainbow
```typescript
navigation: [
  { title: 'Home', url: '/', color: '#e74c3c' },      // Red
  { title: 'Blog', url: '/blog/', color: '#f39c12' },  // Orange
  { title: 'Work', url: '/work/', color: '#2ecc71' },  // Green
  { title: 'About', url: '/about/', color: '#3498db' }, // Blue
]
```

### Pastel Palette
```typescript
navigation: [
  { title: 'Home', url: '/', color: '#ffb3ba' },      // Pastel Pink
  { title: 'Blog', url: '/blog/', color: '#bae1ff' },  // Pastel Blue
  { title: 'Work', url: '/work/', color: '#baffc9' },  // Pastel Green
  { title: 'About', url: '/about/', color: '#ffffba' }, // Pastel Yellow
]
```

### Monochrome Blues
```typescript
navigation: [
  { title: 'Home', url: '/', color: '#1e3a8a' },      // Dark Blue
  { title: 'Blog', url: '/blog/', color: '#3b82f6' },  // Blue
  { title: 'Work', url: '/work/', color: '#60a5fa' },  // Light Blue
  { title: 'About', url: '/about/', color: '#93c5fd' }, // Lighter Blue
]
```

### Dark Mode Friendly
```typescript
navigation: [
  { title: 'Home', url: '/', color: '#10b981' },      // Emerald
  { title: 'Blog', url: '/blog/', color: '#06b6d4' },  // Cyan
  { title: 'Work', url: '/work/', color: '#8b5cf6' },  // Purple
  { title: 'About', url: '/about/', color: '#f59e0b' }, // Amber
]
```

### Professional Grays
```typescript
navigation: [
  { title: 'Home', url: '/', color: '#1f2937' },      // Gray 800
  { title: 'Blog', url: '/blog/', color: '#4b5563' },  // Gray 600
  { title: 'Work', url: '/work/', color: '#6b7280' },  // Gray 500
  { title: 'About', url: '/about/', color: '#9ca3af' }, // Gray 400
]
```

## Adding Custom Pages

### Portfolio Page

Create `src/pages/portfolio.astro`:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';

const projects = [
  {
    title: 'E-commerce Platform',
    tech: 'React, Node.js, Stripe',
    description: 'Full-stack e-commerce solution',
    link: '/work/ecommerce'
  },
  {
    title: 'Mobile App',
    tech: 'React Native, Firebase',
    description: 'Cross-platform mobile application',
    link: '/work/mobile-app'
  },
];
---

<PageLayout title="Portfolio" subtitle="My best work">
  <div class="portfolio-grid">
    {projects.map(project => (
      <div class="portfolio-item">
        <h3><a href={project.link}>{project.title}</a></h3>
        <p class="tech">{project.tech}</p>
        <p>{project.description}</p>
      </div>
    ))}
  </div>
</PageLayout>

<style>
  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2em;
    margin-top: 2em;
  }
  
  .portfolio-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1.5em;
    border-radius: 8px;
  }
  
  .tech {
    color: rgba(0, 0, 0, 0.5);
    font-size: 0.9em;
    margin: 0.5em 0;
  }
</style>
```

### Contact Page with Form

Create `src/pages/contact.astro`:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
---

<PageLayout title="Contact" subtitle="Get in touch">
  <div class="contact-content">
    <div class="contact-info">
      <h2>Let's Connect</h2>
      <p>I'm always interested in hearing about new projects and opportunities.</p>
      
      <ul class="contact-links">
        <li>📧 <a href="mailto:hello@example.com">hello@example.com</a></li>
        <li>🐙 <a href="https://github.com/yourusername">GitHub</a></li>
        <li>🐦 <a href="https://twitter.com/yourusername">Twitter</a></li>
        <li>💼 <a href="https://linkedin.com/in/yourusername">LinkedIn</a></li>
      </ul>
    </div>
    
    <form class="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>
      
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      
      <button type="submit">Send Message</button>
    </form>
  </div>
</PageLayout>

<style>
  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3em;
    margin-top: 2em;
  }
  
  .contact-links {
    list-style: none;
    padding: 0;
    margin-top: 2em;
  }
  
  .contact-links li {
    margin: 1em 0;
    font-size: 1.1em;
  }
  
  .contact-form {
    background: rgba(0, 0, 0, 0.02);
    padding: 2em;
    border-radius: 8px;
  }
  
  .form-group {
    margin-bottom: 1.5em;
  }
  
  label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75em;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-family: inherit;
    font-size: 1em;
  }
  
  button {
    background: var(--link-color);
    color: white;
    border: none;
    padding: 0.75em 2em;
    font-size: 1em;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  button:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    .contact-content {
      grid-template-columns: 1fr;
    }
  }
</style>
```

## Custom Components

### Tag Component

Create `src/components/Tag.astro`:

```astro
---
interface Props {
  name: string;
  color?: string;
}

const { name, color = '#e74c3c' } = Astro.props;
---

<span class="tag" style={`--tag-color: ${color}`}>
  {name}
</span>

<style>
  .tag {
    display: inline-block;
    padding: 0.25em 0.75em;
    background: var(--tag-color);
    color: white;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: bold;
    margin: 0.25em;
  }
</style>
```

Usage in blog posts:

```astro
---
import Tag from '../../components/Tag.astro';
---

<Tag name="JavaScript" color="#f7df1e" />
<Tag name="React" color="#61dafb" />
<Tag name="Node.js" color="#339933" />
```

### Reading Time Component

Create `src/components/ReadingTime.astro`:

```astro
---
interface Props {
  content: string;
}

const { content } = Astro.props;

// Calculate reading time (average 200 words per minute)
const words = content.split(/\s+/).length;
const minutes = Math.ceil(words / 200);
---

<span class="reading-time">
  ⏱️ {minutes} min read
</span>

<style>
  .reading-time {
    color: rgba(0, 0, 0, 0.5);
    font-size: 0.9em;
  }
</style>
```

## Advanced Styling

### Dark Mode Support

Add to `src/styles/variables.scss`:

```scss
:root {
  --text-color: #000;
  --background-color: #fff;
  --link-color: #ff00b4;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #fff;
    --background-color: #1a1a1a;
    --link-color: #ff66cc;
  }
}
```

### Custom Fonts

Add to `src/layouts/BaseLayout.astro`:

```html
<head>
  <!-- ... other head content ... -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
</head>
```

Update `src/styles/variables.scss`:

```scss
:root {
  --fontstack-sans-serif: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Gradient Navigation

Update `src/components/Navigation.astro`:

```astro
<style>
  .navigation a {
    background: linear-gradient(
      135deg,
      var(--nav-link-color) 0%,
      color-mix(in srgb, var(--nav-link-color) 70%, black) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>
```

## Blog Post Templates

### Tutorial Template

```markdown
---
layout: ../../layouts/PostLayout.astro
title: "How to Build X with Y"
description: "Step-by-step guide to building X"
date: 2025-01-15
author: "Your Name"
---

## What We're Building

Brief description of the final product.

## Prerequisites

- Requirement 1
- Requirement 2
- Requirement 3

## Step 1: Setup

Instructions...

## Step 2: Implementation

Code and explanation...

## Step 3: Testing

How to test...

## Conclusion

Summary and next steps.

## Resources

- [Link 1](url)
- [Link 2](url)
```

### Case Study Template

```markdown
---
layout: ../../layouts/PostLayout.astro
title: "Project Name"
description: "Brief description"
date: 2025-01-15
tech: "Technologies used"
---

## Overview

What the project is about.

## The Challenge

What problem needed solving.

## The Solution

How you solved it.

## Technical Details

Architecture, code, etc.

## Results

Metrics and outcomes.

## Lessons Learned

What you learned.
```

## Tips

1. **Use consistent colors** across your navigation for a cohesive look
2. **Test on mobile** - the responsive design adapts automatically
3. **Keep it simple** - the minimalist design is the theme's strength
4. **Use high-quality images** - they make a big difference
5. **Write regularly** - consistency is key for a successful blog

Happy customizing! 🎨

