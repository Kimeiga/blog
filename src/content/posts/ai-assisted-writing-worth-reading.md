---
title: "My AI writing workflow"
description: "Give the model real context, generate less, and delete anything that explains what the reader can already see."
published: "2026-08-20"
tags: [Writing, AI, Research, Blogging]
draft: false
featured: true
hero:
  src: "/images/writing-workflow/hero.webp"
  alt: "An open notebook, pen, and pencils on a wooden desk"
  width: 1600
  height: 900
  credit:
    name: "Clay Banks"
    url: "https://unsplash.com/@claybanks?utm_source=hakanalpay_blog&utm_medium=referral"
    source: "Unsplash"
    sourceUrl: "https://unsplash.com/photos/n9AaeihA9HI?utm_source=hakanalpay_blog&utm_medium=referral"
    license: "Unsplash License"
    licenseUrl: "https://unsplash.com/license"
disclosure: "AI-Assisted"
---

The sentence that made me want to rewrite the first version of this blog was:

> The site is intentionally quiet. The ideas do the moving.

The page was already quiet. The sentence added nothing. Worse, it sounded exactly like an AI explaining a design choice that the reader had already understood by looking at the page.

So I deleted it.

That is now one of the main rules for this blog: **do not narrate what the reader can already see or infer.**

## Redundancy is a useful tell

A 2026 ACL paper called [UMPIRE](https://aclanthology.org/2026.acl-long.1427/) studied human and LLM-generated social posts paired with images. The authors found a useful semantic difference: human posts were more likely to add information beyond the image, while LLM posts were more likely to describe information already present.

That paper is about multimodal social posts, not blog essays, so I would not turn it into a universal detector. But the idea of **redundant versus complementary information** maps well to the AI prose I dislike.

Bad AI writing keeps telling you what just happened:

- a quiet design announces that it is quiet
- a section ends by summarizing itself
- a conclusion restates the introduction
- a paragraph explains why the previous paragraph matters
- every tradeoff gets a sentence saying that it is a tradeoff

The fix is usually deletion, not a more human synonym.

Another [ACL 2026 study](https://aclanthology.org/2026.acl-long.2030/) found that people could post-edit LLM drafts to make them closer to their own style, but the edited text still stayed stylistically closer to LLM output than to their unassisted writing and showed less stylistic diversity. That makes me less interested in the workflow where an AI writes a polished 2,000-word article and I “humanize” it afterward.

I would rather give the model better material and ask it to generate less.

## What I like about Sudowrite

[Sudowrite](https://www.sudowrite.com/) is built for fiction, but its workflow is more interesting to me than the usual blank chat box.

Its [Story Bible](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/what-is-story-bible/jmWepHcQdJetNrE991fjJC) is a persistent source of truth for the project. Style, characters, worldbuilding, outline, POV, and other context stay available while the writer moves between documents.

Its [Write](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/write/pvxUvbQqYybfEosqx1sXjY) tool is basically contextual autocomplete. It can read up to 20,000 words before the cursor and also use Story Bible context. [Rewrite](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/rewrite/9hkeezeUsCiUCG4dRdEqjS) is a separate tool with options such as **Shorter**. [Feedback](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/feedback/7Ew1KgpEwabQSgvijq8QNr) can run custom editorial checks across a draft while seeing the Story Bible.

The part I want to copy is the separation of jobs. Planning, continuation, rewriting, expansion, and critique do not have to be one giant prompt.

Also: Sudowrite has an **Expand** button. For a blog, I want the psychological opposite. Expansion should be opt-in. Compression should be the default.

## My version for this blog

Before drafting, the agent gets a small source of truth:

- what I actually think
- the concrete thing that triggered the post
- relevant code, data, screenshots, or prior writing
- facts that need current sources
- anything I am unsure about

That plays the role of a Story Bible. The point is to keep the model anchored to material that came from somewhere other than its own next-token instincts.

Then I prefer drafting section by section. If I already wrote a paragraph I like, continue from it instead of replacing it with a fresh “professional” version. If a section is weak, rewrite that section. If it is bloated, make it shorter. If the argument has a hole, use a feedback pass instead of padding the hole with transitions.

My older posts are useful style context because they contain details I would never put in a generic voice prompt: a hot apartment, the Turkish name for a Hong Kong orchid tree, the annoyance of memorizing CSS classes, half-finished thoughts. I do not want the model to imitate old typos. I want it to preserve the habit of writing from an actual thing.

## What I cut now

The updated editorial guide has a harsher compression rule.

I cut sentences that:

- explain an obvious design choice
- tell the reader that a point is important instead of making the point
- defend a decision against objections nobody raised
- recap a section that was already clear
- turn a simple preference into a philosophy
- use a heading for two paragraphs that did not need a heading
- describe the writing process when the subject is something else

Disclosures are one line. UI copy is a few words. A page called Blog can say **Blog**.

The agent also gets a custom “redundancy” pass: for each paragraph, ask what new information it contributes. If the answer is “it restates the previous paragraph more smoothly,” delete it.

Facts still get a separate verification pass. Names, dates, prices, releases, laws, statistics, and causal claims are checked against current sources. Style editing cannot rescue a false sentence.

I still want to use AI heavily. I just do not want the model’s instinct to be helpful, comprehensive, and self-explanatory to become the voice of the site.

That is enough of a rule.

## Sources

- [Yi et al., “UMPIRE: Unveiling LLM-generated Posts via Redundant Expressions”](https://aclanthology.org/2026.acl-long.1427/)
- [Baumler et al., “Can You Make It Sound Like You? Post-Editing LLM-Generated Text for Personal Style”](https://aclanthology.org/2026.acl-long.2030/)
- [Sudowrite: Story Bible](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/what-is-story-bible/jmWepHcQdJetNrE991fjJC)
- [Sudowrite: Write](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/write/pvxUvbQqYybfEosqx1sXjY)
- [Sudowrite: Rewrite](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/rewrite/9hkeezeUsCiUCG4dRdEqjS)
- [Sudowrite: Feedback](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/feedback/7Ew1KgpEwabQSgvijq8QNr)
