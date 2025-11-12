# Using Images in Your Blog

This blog supports images in multiple ways:

## 1. Standard Markdown Images

Place images in `public/images/` folder and reference them in markdown:

```markdown
![Alt text](/images/my-photo.jpg)
```

## 2. Images with Captions

```markdown
![A beautiful sunset over the ocean](/images/sunset.jpg)
*Photo taken in Malibu, California*
```

## 3. Astro Image Component (Optimized)

For better performance, you can use Astro's Image component in `.astro` files:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/photo.jpg';
---

<Image src={myImage} alt="Description" />
```

## 4. Remote Images

You can also link to external images:

```markdown
![Remote image](https://example.com/image.jpg)
```

## Best Practices

1. **Use descriptive alt text** for accessibility
2. **Optimize images** before uploading (compress, resize)
3. **Use WebP format** when possible for better compression
4. **Store images in `public/images/`** for static assets
5. **Use Astro's Image component** for automatic optimization

## Example Post with Images

```markdown
---
layout: ../../layouts/PostLayout.astro
title: "My Photo Journey"
subtitle: "Capturing moments around the world"
date: 2025-01-20
author: "Jane Photographer"
---

Here's a photo from my recent trip:

![Mountain landscape](/images/mountains.jpg)

The view was absolutely breathtaking!
```

## Supported Formats

- JPEG/JPG
- PNG
- WebP
- GIF
- SVG

All standard image formats work perfectly in markdown posts!

