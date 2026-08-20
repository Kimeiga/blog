---
title: "How I’m trying to make AI-assisted writing worth reading"
description: "A practical editorial system for using AI without publishing the smooth, repetitive, source-thin prose that has made so much of the web feel disposable."
published: "2026-08-20T22:10:00-04:00"
tags: [Writing, AI, Research, Blogging]
draft: false
featured: true
commentsIssue: 2
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
disclosure: "The method described here was developed from Hakan’s writing archive, his humanize-prose project, current research on AI-text detection, and an editorial pass over this article itself. The piece is AI-assisted and published under Hakan’s direction."
---

The fastest way to ruin this blog would be to make publishing frictionless.

That sounds strange after I built an entire system to make publishing easier. But there are two kinds of friction. One is mechanical: finding the repo, remembering the frontmatter, resizing a photograph, fixing a broken deployment. Removing that friction is good. The other is editorial: deciding whether an idea is true, whether it is mine, whether the evidence is strong enough, and whether the reader will get anything beyond a competent rearrangement of familiar sentences.

AI removes both unless you deliberately put the second kind back.

The result is the texture people now call **AI slop**: prose that is grammatical, comprehensive, and strangely unnecessary. It announces significance before earning it. It divides an obvious point into six headings. It treats every tradeoff as a “delicate balance.” It ends by restating the opening with a warmer adjective.

I do not want to disguise that an AI helped with an article. I want the help to produce something that survives the more important question:

> Would this be worth reading if nobody cared how it was written?

## “Can a detector catch it?” is the wrong acceptance test

OpenAI retired its own AI-text classifier because of its low accuracy. In the evaluation OpenAI published at the time, the classifier caught only 26 percent of AI-written text as “likely AI-written” and incorrectly labeled human text 9 percent of the time. A Stanford-led study found a much uglier failure: several detectors misclassified more than half of a sample of essays by non-native English writers as AI-generated.

That does not mean machine-generated prose has no patterns. Stylometry research finds measurable differences in vocabulary, syntax, punctuation, discourse structure, and the distribution of common words. It means authorship detection is probabilistic, gameable, domain-dependent, and capable of punishing people whose natural style happens to be predictable to a language model.

Optimizing this blog to pass a detector would therefore be both flimsy and unfair. A detector can be one diagnostic signal. It cannot tell me whether the Japanese debt article made the right distinction between gross and net liabilities, whether the Kiokun post explains the actual product constraint, or whether a personal essay says anything I believe.

The acceptance test has to be editorial.

## My old writing is more useful than a generic “human voice” prompt

I have a repository called `humanize`. Its prose skill catalogs surface habits—promotional vocabulary, fake significance, `-ing` tails, em-dash clusters, rule-of-three lists—and deeper narrative habits such as over-explaining the theme and resolving everything too neatly. That research is useful, especially for fiction.

But the best reference for this blog is still the writing I did before generative AI could draft it.

In “Frankly, I think too much,” I move from a hot house to sleeping positions to mentally staging a future TV interview where I have solved a world problem and become famous for it. It is not efficient. It is specific, a little embarrassing, and unresolved. The post ends by asking readers whether they think too much too.

In the Bahunya post, the framework’s name comes from the Hong Kong orchid tree, its Turkish name, a six-petal logo, and the practical annoyance of memorizing classes for semantic HTML. That cluster of details is a fingerprint no generic request for “more personality” would produce.

The lesson is not to add random digressions or typos. It is to preserve the source of the article: the actual irritation, project, conversation, place, opinion, or mixed feeling that made me want to write it.

<figure class="article-photo">
  <img src="/blog/images/writing-workflow/notes.webp" width="1600" height="900" loading="lazy" decoding="async" alt="An open planner beside pens, a ruler, and a small plant" />
  <figcaption>Photo by <a href="https://unsplash.com/@kellysikkema?utm_source=hakanalpay_blog&utm_medium=referral">Kelly Sikkema</a> on <a href="https://unsplash.com/photos/hBdaqrr5Z3k?utm_source=hakanalpay_blog&utm_medium=referral">Unsplash</a> · <a href="https://unsplash.com/license">Unsplash License</a></figcaption>
</figure>

## The workflow starts before the draft

A model is very good at turning a vague subject into answer-shaped text. That is exactly why the first artifact should not be an outline.

It should be a brief with five uncomfortable blanks:

1. **What do I currently think?** Not “the topic,” but the provisional claim.
2. **What creates tension?** A contradiction, cost, uncertainty, or tempting opposing answer.
3. **What do I know firsthand?** Code I wrote, a city I walked, a product decision, a mistake, a conversation, a photograph.
4. **What would change my mind?** The evidence the research must seek rather than avoid.
5. **What should the reader be able to do or see afterward?**

For the EASI country-equality index, “compare equality across countries” would be a weak brief. The real tension is that the Nordic model may achieve extraordinary equality at small population scale, while Japan may be doing something comparably difficult across a much larger, more industrial, more urban society. That question produces an index worth debating. The generic topic produces a listicle.

## Research becomes a claim ledger, not a link pile

AI-assisted research often fails in a polite way. The draft contains citations, but the citations sit near a paragraph rather than supporting its precise claims. A source that proves a number is treated as if it also proves the explanation for the number.

Before drafting, I now want a claim ledger:

| Claim | What kind of statement is it? | Evidence needed | How the article should phrase it |
|---|---|---|---|
| Japan’s gross debt is unusually high | measurable fact | current primary or institutional data | direct, dated statement |
| Its asset position changes the comparison | accounting interpretation | balance-sheet data and methodology | explain the definition |
| The strategy was “genius” | judgment | outcomes, counterfactuals, tradeoffs | attributed or argued, never smuggled in as fact |
| Another country could copy it | inference | institutional differences | explicitly conditional |

This prevents the smoothest failure mode: a paragraph whose first sentence is sourced and whose next four sentences are the model’s plausible continuation.

For current technical work, primary sources come first: framework documentation, specifications, repositories, papers, issue trackers, and actual deployment output. For economics and policy, the article should distinguish official data, reported events, expert interpretation, and my own inference. The citation belongs at the smallest unit that it supports.

## Outline around pressure, not symmetry

The default AI outline is beautifully balanced. That is a problem.

It tends to generate a definition, three benefits, three challenges, best practices, future trends, and a conclusion. The structure feels complete before the research has discovered anything. Every subject gets the same skeleton.

A better outline follows the pressure in the material. The first post on this site moves from the iPhone constraint to archive provenance, framework choice, reading geometry, runtime cost, comments, image licensing, and finally the limits of the Lighthouse claim. The sections are not equally sized because the decisions were not equally difficult.

A useful analytical shape is often:

- the concrete observation
- the simple explanation that first looked right
- the evidence that breaks it
- the model that explains more
- the cost or case that still does not fit
- what changes in practice

Even that should not become a template. The point is to let the argument choose the architecture.

## Draft with named things and honest verbs

AI prose becomes abstract because abstraction is safe. “Organizations can leverage innovative solutions to enhance efficiency” is difficult to falsify and impossible to remember.

The repair is not a thesaurus. It is a noun.

Name the repository. Name the street. Name the train line. Name the exact API, price, model, date, CSS property, dataset, or person whose argument is being summarized. Replace “research suggests” with the paper and the result. Replace “I explored” when the agent did the browsing with “I asked the agent to compare” or simply describe the comparison.

This matters especially for first-person writing. An AI can write an elegant account of “my experience” without possessing one. The workflow forbids invented lived experience, quotes, reactions, and tests. It can help articulate details I supplied or recover details from the actual project history. It cannot manufacture a childhood memory because the paragraph wants warmth.

## The slop pass is structural before it is lexical

Removing `delve`, `tapestry`, and “in today’s rapidly evolving landscape” is easy. A draft can avoid every notorious phrase and still feel generated.

The deeper questions are:

- Does each section discover something, or merely announce and summarize it?
- Does the draft explain the theme after the evidence already made it clear?
- Are all tradeoffs resolved into a reassuring middle position?
- Did every paragraph arrive in the order a textbook would choose?
- Is the conclusion a duplicate introduction with “ultimately” added?
- Are sentence lengths and paragraph shapes unnaturally uniform?
- Did the draft remove every uncertainty, tangent, joke, and sharp opinion in the name of polish?

This is where my `humanize-prose` work is most valuable. Surface cleanup prevents immediate irritation; discourse editing prevents the piece from feeling like a completed form.

The warning goes both ways. Mechanical “anti-AI” editing produces its own style: tiny fragments. Constant reversals. “Not X. Y.” A refusal to use an em dash even when it is the right punctuation. Human writing is not a bag of irregularities. The goal is not random burstiness. It is meaningful variation caused by thought.

## Then perform an adversarial fact pass

The editor should temporarily stop caring whether the prose is beautiful.

Every proper noun, number, date, quotation, product behavior, legal rule, and current role gets checked. Every causal statement gets labeled as source, interpretation, or inference. Unsupported precision is removed. Conflicting reputable sources are represented rather than silently averaged. A source that changed after the model’s knowledge cutoff is reopened at publication time.

For a technical article, the code should run. For an index, the data pipeline should reproduce the displayed numbers. For a site-build retrospective, the repository, workflow logs, and deployed URL should agree with the article. If I say a page scored 100, the audit output needs to exist.

This pass is deliberately separate from style because beautiful prose creates attachment. It is easier to delete a lovely false sentence when the task is explicitly “try to prove this paragraph wrong.”

## Score usefulness, not humanness

The internal rubric has six dimensions, each scored from one to five:

- **Specificity:** named evidence and irreducible context
- **Original synthesis:** a connection or model not copied from one source
- **Tension:** serious alternatives and unresolved costs
- **Usefulness:** a decision, method, implementation, or new way to notice
- **Voice:** judgments and rhythms that fit me rather than “a smart blogger”
- **Evidence:** support proportional to the strength and freshness of the claim

A seventh dimension—**compression**—is subtractive. Repetition, ceremonial transitions, and paragraphs that exist only to make a section feel complete lower the score.

An article does not need a perfect score in every dimension. A personal essay may rely more on specificity and voice than external evidence. A build log may be maximally useful and only lightly argumentative. The rubric forces an intentional reason for the piece to exist.

## Photographs have to pass the same test

A generic image of a robot hand holding a glowing pen would make this article look more automated, not less.

The photographs here are ordinary work surfaces: a blank notebook, pens, tools, an unfinished page. They provide material texture and pacing without pretending to visualize “artificial intelligence.” They are downloaded into the repository, compressed, and credited in place. The quiet attribution is part of the editorial record, not an SEO caption.

A post about Tokyo should prefer a real, licensed photograph of the exact station, street, housing type, or public space under discussion. A Kiokun post should lead with the product and its cards. An economic index should show the chart or data-generating idea before a stock photograph of a skyline.

This sounds obvious. A lot of AI-era publishing fails precisely because the obvious step was automated away.

## The final disclosure is specific, not ritualistic

“AI was used in the creation of this content” tells the reader almost nothing. Used how? For transcription? Research? A first draft? Every factual claim? Was the author involved beyond pressing publish?

This blog can attach a short editorial note to a post. The note should describe the actual division of labor. For this article, I supplied the goal, the writing archive, the `humanize` project, the standard, and the approval; the agent researched current literature, proposed the workflow, drafted, checked the repository, and revised against the system it describes.

Disclosure does not rescue bad work. It gives good work an honest provenance.

## What happens when I ask for the next post

The saved workflow is now concrete enough to be repeated:

1. Read the repository’s agent guide and editorial style.
2. Recover the relevant project and conversation history.
3. Produce the five-part brief before an outline.
4. Research a claim ledger with current sources.
5. Draft around the material’s real pressure points.
6. Run fact, voice, slop, readability, title, and image passes.
7. Validate the site and open a reviewable pull request.
8. Verify the deployed result before claiming success.

The agent is allowed to make the mechanical path nearly effortless. It is not allowed to make the article effortless.

That distinction is the whole system.

## Sources and further reading

- [OpenAI’s retired AI-text classifier and its documented limitations](https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/)
- [Liang et al., “GPT detectors are biased against non-native English writers”](https://doi.org/10.1016/j.patter.2023.100779)
- [Fredrick and Craven on lexical diversity, syntactic complexity, and readability in ChatGPT and student essays](https://doi.org/10.3389/feduc.2025.1616935)
- [O’Sullivan, “Stylometric comparisons of human versus AI-generated creative writing”](https://www.nature.com/articles/s41599-025-05986-3)
- [The `humanize-prose` skill used as one input to this workflow](https://github.com/Kimeiga/humanize/blob/main/skills/humanize-prose/SKILL.md)
- [The complete editorial style guide for this blog](https://github.com/Kimeiga/blog/blob/main/docs/EDITORIAL_STYLE.md)
