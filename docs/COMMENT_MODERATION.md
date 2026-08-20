# Comment moderation

The launch configuration uses GitHub Issues as the comment store. Every article with a
`commentsIssue` field points to one public issue. Readers can report a comment on GitHub;
repository maintainers can edit labels, delete comments, lock a thread, or block abusive
accounts without operating a separate database.

## Default: GitHub-native moderation

This mode is active without configuration and costs nothing. It provides:

- authenticated posting and GitHub's account-level anti-abuse controls;
- a public edit and moderation trail;
- reporting, deletion, locking, and blocking;
- no cookie banner or user-data store owned by the blog.

Anonymous comments are intentionally not accepted. Adding them would require a write API,
spam controls, privacy policy, abuse queue, and durable identity or rate-limiting system.

## Optional: automated first-pass moderation

`.github/workflows/moderate-comments.yml` can send each new comment on a `Comments:` issue
to OpenAI's Moderation endpoint. It is disabled by default and never runs without both:

1. an Actions repository variable named `ENABLE_AI_COMMENT_MODERATION` set to `true`; and
2. an Actions repository secret named `OPENAI_API_KEY`.

The Moderation endpoint is currently free for OpenAI API users, but an API credential is
still required. Do not put that key in a committed file, issue, pull request, or client-side
JavaScript.

When enabled, a flagged comment is deleted and replaced with a short public moderation
notice. Automated classification can produce false positives, so maintainers should review
GitHub notifications and restore legitimate discussion when needed. The workflow ignores
bot-authored notices to avoid loops.

Official references:

- https://help.openai.com/en/articles/4936833-is-the-moderation-endpoint-free-to-use
- https://developers.openai.com/api/docs/models/omni-moderation-latest
