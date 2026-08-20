---
title: "Building a blog an AI agent can actually maintain"
description: "How I rebuilt my scattered writing into a fast, readable, source-controlled publication that can be updated from a phone conversation without becoming another generic AI website."
published: "2026-08-20T21:20:00-04:00"
tags: [Software, Design, Blogging, AI]
draft: false
featured: true
commentsIssue: 1
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
disclosure: "This article documents work Hakan directed and an AI agent implemented in the public repository. It was researched, drafted, and edited collaboratively; the design choices and final claims were reviewed against the actual build."
---

I asked for this site from my iPhone.

That detail sounds incidental, but it was the actual design problem. I already had places where words could live: an old Jekyll blog, a newer Astro repository, technical posts tucked into a LeetCode repo, and a portfolio at `hakanalpay.com`. What I did not have was a publication that was easier to update than it was to neglect.

A beautiful CMS with a separate login would not solve that. Neither would a fashionable template with twenty dependencies and a homepage optimized for selling a newsletter. I wanted to be able to finish a conversation here, say “make this a post,” review the result, and have the same agent update the real site without losing sources, images, dates, or the rest of the archive.

So the project began with a less glamorous question than “Which framework is best?”

> What is the smallest system that makes publishing from a conversation safe, durable, and good to read?

## The archive was a data problem before it was a design problem

The obvious repositories were `blog` and `blog-old`. The less obvious one was `leetcode`, where three dated solution write-ups were already formatted as posts. There were also old theme experiments—Fastpages and Lanyon—with demo articles written by the template authors.

A naive migration would have copied every Markdown file and quietly attributed boilerplate to me. The new system instead keeps an explicit source manifest: nine authored posts from `blog-old`, three authored technical notes from `leetcode`, and nothing from the stock demo archives. A synchronization script fetches those exact paths, normalizes their frontmatter, fixes a few broken legacy links, optimizes the original images, and commits ordinary Markdown copies into this repository.

That distinction matters. “Import everything” is not archival care. Provenance is.

## Why Astro won even though I usually prefer Svelte

I have an extremely strong preference for Svelte over React. This site still uses Astro.

The reason is that a blog is mostly a set of documents. Astro’s default output is static HTML, and its [content collections](https://docs.astro.build/en/guides/content-collections/) validate every post’s title, description, dates, tags, image dimensions, credits, and publication state at build time. I can add Svelte when an interaction genuinely needs it, but the reader does not download a site-wide runtime merely because I enjoy a particular component model.

The production dependency list has one entry: Astro. Search, RSS, the JSON feed, the sitemap, tag pages, reading time, and comments are implemented with the platform and build-time code rather than a parade of plugins.

That gives the agent a small surface to understand. More importantly, it gives future me fewer things to update when I would rather be writing.

<figure class="article-photo">
  <img src="/blog/images/building-blog/code.webp" width="1600" height="900" loading="lazy" decoding="async" alt="A dark code editor showing JavaScript, tests, and a terminal" />
  <figcaption>Photo by <a href="https://unsplash.com/@hdbernd?utm_source=hakanalpay_blog&utm_medium=referral">Bernd Dittrich</a> on <a href="https://unsplash.com/photos/9-U8xW54Le0?utm_source=hakanalpay_blog&utm_medium=referral">Unsplash</a> · <a href="https://unsplash.com/license">Unsplash License</a></figcaption>
</figure>

## Readability is geometry, not decoration

The site does not load a webfont. The interface uses the operating system’s sans serif; articles use a platform serif stack beginning with Iowan Old Style. This is partly a performance decision, but it is also an aesthetic one. The typography feels like it belongs to the reader’s device rather than to a theme demo.

The more important choices are almost invisible:

- The article column is capped at 45 rem, which usually produces roughly 60–72 characters per line at the chosen body size.
- Body text scales from about 17 to 19 pixels and uses a 1.72 line height.
- Paragraphs are left-aligned, never justified.
- Heading sizes change fluidly, but the reading measure does not sprawl across a desktop monitor.
- Images reserve their dimensions before loading, so the text does not jump.

The [W3C’s text presentation guidance](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html) uses 80 characters as an upper bound for blocks of text and calls for at least 1.5 line spacing. I treated those as guardrails, not a recipe. The final measure was adjusted by reading actual long paragraphs on a phone, a tablet-sized viewport, and a wide desktop.

The breakpoints work the same way. They are not “iPad,” “laptop,” and “large laptop.” At 45 rem, the full navigation and two columns stop feeling cramped. At 64 rem, three archive cards fit. At 80 rem, a table of contents can occupy a side rail without stealing width from the article. A breakpoint exists because the content failed immediately below it.

## Dark by default, but not black by ideology

The default background is a near-black `#0b0c0d`, not OLED black. Pure black makes light text feel harsher and removes the ability to create depth with nearby surfaces. The text is warm off-white rather than blue white. The accent is a restrained vermilion borrowed from the energy of my existing portfolio, while the light theme uses a warm paper background instead of sterile white.

The theme script runs in the document head before the page paints. If a reader chose light last time, the browser applies it before CSS renders; there is no bright flash. Without a stored choice, the site stays dark, exactly as requested. The standard [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme) metadata also lets built-in controls render correctly in both modes.

There are no gradients. There is one subtle shadow on genuinely raised editorial cards, borders do most of the grouping, and motion disappears under `prefers-reduced-motion`.

## The interaction budget is paid only after intent

A static page is not automatically fast. It is easy to attach enough widgets to static HTML that the distinction stops mattering.

This site starts with almost no JavaScript:

1. A tiny inline script applies the saved theme before first paint.
2. The theme button swaps one attribute and stores the choice.
3. The copy-link button exists only on article pages.

Search is a generated JSON index, but it downloads only on `/search/`, after the reader focuses the box or submits a query. The query never leaves the browser. Comments do not contact GitHub until the reader presses **Load comments**.

I researched Pagefind because it is an excellent static search system: it builds a chunked index after the site compiles and can keep even a 10,000-page site’s search payload small. This archive is nowhere near that scale. A dependency-free index is simpler today; the architecture leaves a clean upgrade path if the corpus becomes large enough for Pagefind’s chunking to matter.

## Comments without turning the blog into a social network

The obvious options were Disqus, utterances, and giscus. Disqus adds an advertising and tracking relationship I do not want. [giscus](https://giscus.app/) is open source, free, and stores comments in GitHub Discussions, but it requires Discussions to be enabled and its GitHub App to be installed. It is a good choice for many developer blogs.

For this site, I went one layer simpler. Each article can point to a normal GitHub issue. The page reads that issue’s public comments through GitHub’s API only when requested, renders them as plain text, and sends writers to GitHub to post. There is no comment database, iframe, ad network, cross-site identity profile, or JavaScript on a reader who never opens the section.

Anonymous comments were deliberately left out. A free anonymous endpoint would create a spam target, a moderation queue, and a new store of user data. Requiring a GitHub identity is imperfect—it favors technical readers—but it is honest about the tradeoff and keeps moderation durable and reversible.

The repository includes a design for optional automated moderation through a GitHub Action. OpenAI’s current moderation model is [free through the Moderation API](https://developers.openai.com/api/docs/models/omni-moderation-latest), but it still requires an API key secret. I did not smuggle a credential into the repository merely to claim the checkbox was complete.

## Photographs are files, not unstable embeds

The first version of this post could have hotlinked an Unsplash CDN URL. That would have been quicker and worse.

Every new editorial photograph is downloaded, cropped intentionally, stripped of metadata, converted to a 1600×900 WebP, and checked into the repository. The image has explicit dimensions for layout stability, useful alt text, and a small credit immediately below it. [Unsplash allows free commercial and non-commercial use](https://unsplash.com/license), and attribution is appreciated even when it is not required; this site credits anyway. Pexels and Wikimedia Commons are documented alternatives when they fit the subject better.

<figure class="article-photo">
  <img src="/blog/images/building-blog/editorial-layout.webp" width="1600" height="900" loading="lazy" decoding="async" alt="A close view of a carefully designed printed editorial layout" />
  <figcaption>Photo by <a href="https://unsplash.com/@heathvestercreative?utm_source=hakanalpay_blog&utm_medium=referral">Heath Vester</a> on <a href="https://unsplash.com/photos/lbfd7zw0LTk?utm_source=hakanalpay_blog&utm_medium=referral">Unsplash</a> · <a href="https://unsplash.com/license">Unsplash License</a></figcaption>
</figure>

The photo is not there to prove that the article is “premium.” It creates a change of texture at the exact point where the subject changes from software architecture to editorial care. If an image cannot do at least that much, the page is usually better without it.

## The repository is the CMS

A post is a Markdown file with typed frontmatter. The workflow for a future request is now written into `AGENTS.md`:

1. Recover the relevant project and conversation context.
2. Turn the request into a brief with a claim, tension, audience, and useful outcome.
3. Research current facts and build a claim ledger.
4. Draft against the editorial style guide.
5. Download and attribute images.
6. Run content validation and the production build.
7. Make one branch and one pull request.
8. Merge after checks, then verify the deployment and canonical URL.

On iOS, I can also open a **Blog post request** issue with a compact form. That is useful when I have the thought but not the patience to turn it into a prompt. The issue preserves the actual claim and evidence until an agent picks it up.

The same system protects against agent mistakes. Drafts are excluded from production. Schema errors fail the build. A content linter checks missing local images and warns about common generic phrases. Git history records every factual correction. Pull requests make the diff inspectable before publication.

## About the promised Lighthouse 100

The site is engineered for a perfect audit: static HTML, no webfonts, no analytics, explicit image dimensions, high contrast, accessible controls, canonical metadata, structured data, and nearly no startup JavaScript.

But “100 on every page” is not a design adjective. It is a measurement from a deployed build, under particular network and browser conditions. The repository therefore contains a test matrix rather than a permanent boast. The image-heavy latest post, a code-heavy legacy post, search before and after interaction, the archive, both themes, 200 percent zoom, keyboard navigation, and several viewport widths all need to pass.

That is a less exciting sentence than “perfect by construction.” It is also how the rest of the site was built: make the claim only as strong as the evidence.

## What I ended up building

The result is not the most feature-rich blog on the internet. It has the features I can defend:

- a real archive with provenance
- tags without a taxonomy bureaucracy
- private local search
- RSS and JSON Feed
- a sitemap, canonical URLs, social cards, and BlogPosting structured data
- dark and light themes
- issue-backed comments
- local licensed photography
- print styles and accessibility accommodations
- a public editorial system for AI-assisted work
- a GitHub workflow an agent can safely repeat

Most importantly, publishing is now close to the place where the idea begins. The distance from “we should write this up” to a reviewed file in the real repository is a conversation and a diff.

That was the actual product.

## Sources and implementation notes

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [W3C guidance on visual presentation of text](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html)
- [MDN on `color-scheme`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme)
- [Pagefind’s static search architecture](https://pagefind.app/)
- [giscus](https://giscus.app/) and [utterances](https://github.com/utterance/utterances)
- [Unsplash License](https://unsplash.com/license) and [Pexels License](https://www.pexels.com/license/)
- [The public source and decision records](https://github.com/Kimeiga/blog)
