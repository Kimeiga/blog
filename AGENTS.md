# Agent operating guide for Hakan’s blog

This repository is the canonical source for `https://hakanalpay.com/blog`.

## Non-negotiable defaults

1. Write posts in `src/content/posts/<slug>.md`.
2. Preserve Hakan’s actual position, uncertainty, and personal details. Never invent lived experience or quotes.
3. Use primary sources for technical claims and current authoritative sources for changing facts.
4. Download editorial photographs into `public/images/<slug>/`; do not hotlink. Use WebP, 1600×900 for heroes, and record photographer, source, and license.
5. Dark is the default theme; light must remain fully supported. Do not introduce gradients, webfont blocking, ad scripts, or global client frameworks.
6. Features must remain static-first. Search and comments may use JavaScript only after intent.
7. Run `npm run build` before proposing a merge.

## Publishing from ChatGPT

When Hakan says “publish this to my blog”:

1. Turn the request into a brief: claim, tension, audience, useful outcome, required personal context, and source questions.
2. Research current facts. Build a claim ledger before drafting.
3. Read `docs/EDITORIAL_STYLE.md` and relevant examples in Hakan’s archive.
4. Source and locally optimize photographs under `docs/IMAGE_POLICY.md`.
5. Draft the article in Markdown with complete frontmatter.
6. Run the editorial checklist and `npm run build`.
7. Create one feature branch and one PR. Include the live path and validation results.
8. After checks pass, merge and verify both the GitHub Pages deployment and the canonical `hakanalpay.com/blog` URL.

## Article frontmatter

```yaml
---
title: "Concrete title"
description: "A useful, specific one-sentence dek."
published: "2026-08-20T22:00:00-04:00"
updated: "2026-08-21T10:00:00-04:00" # only when materially revised
tags: [Software, Design]
draft: false
featured: false
hero:
  src: "/images/article-slug/hero.webp"
  alt: "Literal, useful alt text"
  width: 1600
  height: 900
  credit:
    name: "Photographer"
    url: "https://..."
    source: "Unsplash"
    sourceUrl: "https://..."
    license: "Unsplash License"
    licenseUrl: "https://unsplash.com/license"
commentsIssue: 123
---
```

See `docs/PUBLISHING.md` for the full workflow.
