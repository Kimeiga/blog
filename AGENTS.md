# Agent guide for Hakan’s blog

Canonical source: `https://github.com/Kimeiga/blog`
Public URL: `https://hakanalpay.com/blog/`

## Defaults

1. New posts live in `src/content/posts/<slug>.md`.
2. Preserve Hakan’s actual position and uncertainty. Never invent experience, quotes, reactions, tests, or memories.
3. Use current primary sources for changing factual claims.
4. Prefer real licensed photographs. Store them locally under `public/images/<slug>/` with credits.
5. Dark mode is default; light mode must work. Accent color is golden yellow.
6. Keep the site static-first.
7. Run the production build before publication.

## Historical archives

Hakan’s older public writing is part of this blog, not source material to rewrite.

- `src/content/posts/legacy/` contains earlier GitHub/Jekyll writing.
- `src/content/posts/imported/wordpress/` mirrors the public `kimeiga.wordpress.com` archive, including the standalone `Lonely-CLA` page.
- `src/content/posts/imported/substack/` mirrors the public `deltastar.substack.com` archive.
- Imported media lives under `public/images/imported/`.

For imported work, preserve the original article text, headings, emphasis, links, blockquotes, captions, image order, and media. Do **not** run the humanize/rewrite workflow over historical prose. The original public URL belongs in `legacySource`. If an upstream image is copied locally, rewrite the article HTML to the local `/blog/images/imported/...` URL rather than hotlinking it.

Use `scripts/import-public-archives.mjs`, `scripts/import-substack-by-id.mjs`, and `docs/PUBLIC_ARCHIVE_IMPORT.md` when auditing or deliberately re-running the migration. Do not routinely resync old archives after Hakan starts editing a migrated copy on the new blog.

## Writing

Read `docs/EDITORIAL_STYLE.md` before drafting.

The most important rule is **complement, do not describe**. Do not explain what the reader can already see, what the previous paragraph already established, or what the page already demonstrates.

Before prose, collect a small source of truth:

- claim/question
- trigger or concrete example
- Hakan’s opinion/uncertainty
- relevant project material
- facts to research

Then work in smaller passes. Prefer continuation from real notes, section-sized drafting, targeted Rewrite, and a Shorter pass over one-shot article generation.

Do not use “Expand” logic by default. If a paragraph can be removed without losing information, remove it.

Public copy should be terse. Do not put editorial philosophy in the UI. A page called Blog can say `Blog`.

AI disclosure, when useful, should normally be one short line such as `AI-assisted.`

## Publishing from ChatGPT

When Hakan asks to publish:

1. Recover the relevant context and source material.
2. Research current facts.
3. Draft in Markdown.
4. Run truth, redundancy, compression, and voice passes.
5. Add and credit useful images.
6. Build the site.
7. Publish from a feature branch and verify the deployed URL.

## Frontmatter

```yaml
---
title: "Concrete title"
description: "One specific sentence."
published: "2026-08-20"
tags: [Software, Design]
draft: false
featured: false
hero:
  src: "/images/article-slug/hero.webp"
  alt: "Literal alt text"
  width: 1600
  height: 900
  credit:
    name: "Photographer"
    source: "Wikimedia Commons"
    sourceUrl: "https://..."
    license: "CC BY-SA 4.0"
    licenseUrl: "https://..."
commentsIssue: 123
disclosure: "AI-assisted."
---
```

See `docs/PUBLISHING.md` for deployment details.
