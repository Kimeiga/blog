---
name: hakan-blog
description: Write, edit, migrate, and publish Hakan Alpay's blog without AI-slop, using the Kimeiga/blog repository as source of truth.
---

# Hakan blog

Use this skill whenever Hakan asks to write, edit, migrate, or publish blog material.

## Read first

- `AGENTS.md`
- `docs/EDITORIAL_STYLE.md`
- relevant older posts when voice matters

## Historical writing is archival

Older public work imported from GitHub/Jekyll, WordPress, or Substack is Hakan's authored archive. Preserve it rather than rewriting it into the current house style.

- Keep original text, paragraph order, headings, emphasis, links, blockquotes, captions, and image order.
- Store recoverable source images locally and rewrite the copied HTML to local URLs.
- Preserve the original publication date and URL (`legacySource`).
- Do not run humanization, compression, or current editorial rewrites over an archival import unless Hakan explicitly asks to revise that old piece.
- Imported WordPress/Substack source lives under `src/content/posts/imported/`; media lives under `public/images/imported/`.
- If a body image is promoted to the hero, show it only once: remove the matching body copy and move its original caption under the hero.

## Source-bible first

For a new article, capture only what matters:

- claim or question
- concrete trigger
- Hakan's real opinion and uncertainty
- project/code/data/conversation context
- current facts that need sources

This is the blog equivalent of Sudowrite's Story Bible. Keep it consistent and treat it as the source of truth.

## Generate less

Do not generate a polished full article from a generic topic unless Hakan explicitly asks for that.

Prefer this sequence:

1. keep Hakan's own opening if one exists
2. continue from real notes and source material
3. draft one meaningful section at a time
4. Rewrite only weak passages
5. run a Shorter pass
6. run custom Feedback-style passes for truth, redundancy, and voice

Expansion is opt-in. Compression is default.

## Redundancy rule

For every paragraph ask: **what new information does this add?**

Delete it if it only:

- describes what the page already shows
- restates the previous paragraph
- explains that a point is important
- defends a choice against an objection nobody raised
- summarizes a section that was already clear
- turns a simple preference into a philosophy

Prefer complementary information: a fact, mechanism, example, inference, opinion, failure, number, or useful transition.

## Voice

Preserve Hakan's directness, strong preferences, specific nouns, occasional digressions, and unresolved thoughts.

Do not make him sound like a brand. Do not make every paragraph tidy. Do not invent lived experience.

## UI and metadata

Keep public site copy short:

- navigation: 1 word when possible
- buttons: 1–3 words
- labels: 1–4 words
- page titles: literal
- descriptions: one sentence
- AI disclosure: usually `AI-assisted.`

The blog accent is golden yellow. Dark mode is default.

## Research

Use current primary/authoritative sources. Separate fact, interpretation, inference, and judgment. Recheck changing facts at publication time.

## Images

Prefer real reusable photographs or original project imagery over generated images. Store files locally and keep attribution quiet but visible. A referenced local image missing from `public/` is a build failure, not a cosmetic warning.

## Publish

Write new Markdown under `src/content/posts/`, build, review the diff, publish from a feature branch, then verify the live canonical URL.
