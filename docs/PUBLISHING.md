# Publishing workflow from ChatGPT, iOS, or a local editor

## Fast path from ChatGPT

A request such as “turn our EASI work into a blog post” should produce one auditable change:

1. ChatGPT reads this repository, `AGENTS.md`, and the editorial style guide.
2. It recovers the relevant prior project context and asks only for genuinely missing positions or private facts.
3. It researches current claims and collects primary sources.
4. It writes a post, downloads/optimizes licensed images, and adds or opens the post’s comments issue.
5. It validates the content and build on a feature branch.
6. It opens one PR with a precise summary and merges after checks.
7. It verifies the Pages run and canonical URL.

The Git repository is the CMS. There is no separate editor database to drift, expire, or lock the archive into a vendor.

## Capture from a phone

For an undeveloped idea, create a **Blog post request** issue in GitHub. The template asks for the working title, actual claim, evidence/personal context, and desired reader outcome. ChatGPT can later turn that issue into a draft without losing the original prompt.

## Local drafting

```bash
npm ci
npm run new -- "A concrete working title"
npm run dev
npm run build
```

## Publication states

- `draft: true`: visible in local development, absent from production routes and feeds.
- `draft: false`: public after merge.
- `featured: true`: eligible for prominent editorial placement; use sparingly.
- `updated`: add only for a material correction or expansion, not typo fixes.

## Comments

Each published post can point to one GitHub issue with `commentsIssue`. The page reads comments through GitHub’s public API only after the reader presses **Load comments**. Posting happens on GitHub, giving the blog identity, spam controls, reporting, and a durable moderation trail without a third-party comment database.

Anonymous commenting was intentionally not enabled. A free anonymous endpoint would add a spam surface, private data handling, and a moderation service to a site that otherwise needs no backend. Private reactions can still be sent to Hakan through his usual contact channels.
