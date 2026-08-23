---
title: "Rebuilding my blog"
description: "Astro, Markdown, GitHub Pages, Cloudflare, and a publishing flow I can use from ChatGPT on my phone."
published: "2026-08-20"
tags: [Software, Design, Blogging, AI]
draft: false
featured: true
hero:
  src: "/images/building-blog/hero.webp"
  alt: "A designer editing a logo system on a laptop in a workshop"
  width: 1600
  height: 900
  credit:
    name: "Compagnons"
    url: "https://unsplash.com/@sigmund?utm_source=hakanalpay_blog&utm_medium=referral"
    source: "Unsplash"
    sourceUrl: "https://unsplash.com/photos/-7oi_5uJPC4?utm_source=hakanalpay_blog&utm_medium=referral"
    license: "Unsplash License"
    licenseUrl: "https://unsplash.com/license"
disclosure: "AI-assisted."
---

I wanted to be able to say “turn this into a post” in ChatGPT on my phone and have it land on my actual blog.

My writing was already scattered across an old Jekyll blog, a newer `blog` repo, a few LeetCode write-ups, and my portfolio. Updating any of them was enough of a chore that I mostly did not.

So I rebuilt the blog around the place I already use for code: GitHub.

## The stack

The canonical repo is [`Kimeiga/blog`](https://github.com/Kimeiga/blog). Posts are Markdown. Astro turns them into static HTML.

I normally prefer Svelte, but a blog is mostly documents. Astro gives me typed content collections, static output, and almost no browser JavaScript without making me build a publishing system from scratch.

The public build lives at `kimeiga.github.io/blog`. `hakanalpay.com/blog` proxies that subtree through the Cloudflare deployment that already serves my portfolio, so the blog can stay its own repo without giving up the main domain.

Search is local. RSS, JSON Feed, tags, archives, a sitemap, and social metadata are generated at build time. Comments use GitHub and load only when opened.

<figure class="article-photo">
  <img src="/blog/images/building-blog/code.webp" width="1600" height="900" loading="lazy" decoding="async" alt="A dark code editor showing JavaScript, tests, and a terminal" />
  <figcaption>Photo by <a href="https://unsplash.com/@hdbernd?utm_source=hakanalpay_blog&utm_medium=referral">Bernd Dittrich</a> on <a href="https://unsplash.com/photos/9-U8xW54Le0?utm_source=hakanalpay_blog&utm_medium=referral">Unsplash</a> · <a href="https://unsplash.com/license">Unsplash License</a></figcaption>
</figure>

## Moving the old posts

I found nine posts in `blog-old` that were actually mine and three dated technical posts in the LeetCode repo.

There were also theme demos and sample posts. Those stayed out. The migration script imports an explicit list of authored files, keeps the original dates, normalizes frontmatter, and copies the old images into the new site.

That was safer than treating “Markdown in one of my repos” as equivalent to “something I wrote.”

## The design

The default theme is dark, with a light option. The accent is the same golden yellow I use elsewhere, `#e3bd12` on dark backgrounds. The article column tops out at 45rem, and the body uses a system serif stack led by Iowan Old Style.

I tried to delete more than I added. The homepage now says **Blog**, shows the latest post, tags, and recent writing. It does not need a paragraph explaining that it is minimal.

Photographs are stored locally as WebP files with small credits under them. I would rather use a real licensed photograph than an AI image unless the image itself is the subject.

## Publishing from ChatGPT

The repo has an `AGENTS.md`, an editorial guide, and a small blog skill. They tell an agent where posts live, how frontmatter works, how to handle sources and images, and what has to pass before publication.

The writing workflow is deliberately less automatic than the deployment workflow:

1. start with the actual claim, notes, code, data, or conversation
2. research anything that can change or be wrong
3. write the post in Markdown
4. cut repetition and generic explanation
5. build the site
6. publish the reviewed branch

The mechanical part can be agentic. The opinion should still be mine.

## What broke while setting it up

The deployment was more educational than the architecture diagram.

- An Unsplash download URL started returning `401`, so image acquisition became optional instead of blocking the whole build.
- One old Jekyll timestamp parsed into an invalid Astro date.
- The bootstrap accidentally preserved the old project’s `package-lock.json`, which gave the new Astro app the wrong dependency graph.
- Vite expected `lightningcss`, so I made it explicit instead of relying on an optional transitive dependency.
- GitHub Actions successfully built the new site and then refused to push because the generated commit touched workflow files without workflow permission. I separated the site-source commit from workflow changes.

After those fixes the static build produced the archive, feeds, search, tag pages, and the new posts, and `Kimeiga/blog` became the source of truth.

Now the useful part is boring: when I have something worth writing, I can start from the conversation instead of starting from repo archaeology.

## Links

- [Blog source](https://github.com/Kimeiga/blog)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [W3C text presentation guidance](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html)
- [GitHub Pages](https://docs.github.com/en/pages)
