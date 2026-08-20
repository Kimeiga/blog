# Editorial style

Write like there is a reader on the other side who already knows how to infer things.

The target is not “human-looking AI.” It is Hakan’s actual idea, useful evidence, and as little prose as the idea needs.

## First rule: complement, do not describe

A useful lens from [UMPIRE (ACL 2026)](https://aclanthology.org/2026.acl-long.1427/) is semantic redundancy versus complementary information. In that paper’s multimodal setting, LLM-generated posts were more likely to describe information already present while human posts more often added context.

Apply that as an editing rule, not an authorship detector:

- Do not tell the reader a sparse page is “intentionally quiet.”
- Do not explain that a visible tradeoff is a tradeoff.
- Do not summarize a paragraph that was already clear.
- Do not say why a fact matters when the consequence is obvious.
- Do not restate the introduction in the conclusion.

If a sentence adds no new fact, inference, image, opinion, mechanism, or useful transition, delete it.

## Trust the reader

Cut defensive prose. Do not pre-answer every possible objection or justify every taste preference.

A design preference can simply be a preference. A page called Blog can say **Blog**. A disclosure can say **AI-assisted.**

Explain a decision only when the explanation contains something the reader could not infer: a constraint, failure, measured result, weird implementation detail, or real tradeoff.

## Use a source of truth before prose

Sudowrite’s Story Bible is a useful model: persistent project context should exist before generation. For a blog post, keep a small brief with:

- the claim or question
- the thing that triggered it
- Hakan’s actual opinion and uncertainty
- relevant code, data, screenshots, conversations, or old writing
- facts that require current research

Do not let a generic outline become the source of truth.

## Generate less

Sudowrite separates Write, Rewrite, Expand, and Feedback. Copy that separation.

Prefer:

1. Hakan’s notes or opening paragraph.
2. Contextual continuation or a section-sized draft.
3. Targeted rewrites of weak passages.
4. A **Shorter** pass.
5. Separate fact and editorial feedback passes.

Do not default to generating a polished full article from a title and then “humanizing” it. [Baumler et al. (ACL 2026)](https://aclanthology.org/2026.acl-long.2030/) found that human post-editing moved LLM drafts toward the editor’s style, but the edited text still remained stylistically closer to LLM output and less diverse than unassisted human writing.

Expansion is opt-in. Compression is the default.

## Hakan’s voice

Use Hakan’s archive as style context, not a bag of quirks to imitate.

Useful tendencies:

- direct openings
- named products, places, repos, people, prices, dates, and mechanisms
- strong preferences without a paragraph of justification
- unresolved thoughts when the issue is genuinely unresolved
- occasional digressions that came from the real experience
- technical detail when it changes the conclusion

Do not make every paragraph equally polished. Do not smooth away a distinctive sentence just because another phrasing is more conventional.

## Common AI patterns to cut

- throat-clearing about a changing landscape
- explaining the article’s own structure
- “why this matters” paragraphs when it is already obvious
- fake significance and ceremonial conclusions
- symmetrical lists created for completeness
- reflexive “not X, but Y” constructions
- recap paragraphs after sections
- generic abstractions where a named thing exists
- excessive headings for tiny sections
- self-congratulatory copy about being minimal, thoughtful, careful, transparent, fast, or reader-first
- first-person claims that imply Hakan personally researched, tested, saw, or felt something he did not

## UI copy

UI text should be unusually short.

- navigation: usually 1 word
- buttons: usually 1–3 words
- labels: usually 1–4 words
- page titles: say what the page is
- descriptions: one sentence at most

Never use the interface to explain the philosophy of the interface.

## Structure

Let the material determine section count. As a rough smell test, a short post should not have a new H2 every two paragraphs.

A section should earn its heading by changing the question, evidence, place, time, or mechanism. Otherwise keep writing.

Conclusions are optional. Stop when the argument is finished.

## Source discipline

While researching, separate:

| Kind | Treatment |
|---|---|
| reported fact | current primary or authoritative source |
| interpretation | attributed and, when contested, compared |
| Hakan’s inference | clearly written as an inference |
| judgment | criteria made explicit when they are not obvious |

Recheck dates, prices, laws, releases, office-holders, product behavior, and current claims at publication time.

## Editing passes

1. **Truth:** verify proper nouns, numbers, dates, quotations, links, and causal claims.
2. **Redundancy:** what new information does each paragraph add?
3. **Compression:** delete explanations, transitions, headings, and conclusions that are not needed.
4. **Voice:** restore concrete nouns, opinions, uncertainty, humor, and useful irregularity.
5. **Read aloud:** fix sentences that are hard to say, not merely sentences that are long.

The best final question is: **what can I delete without making this less useful?**
