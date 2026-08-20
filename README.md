# Hakan Alpay’s blog

Canonical source for **hakanalpay.com/blog**.

The site is a static Astro publication designed for durable Markdown, fast reading, and direct maintenance by Hakan or an AI agent through GitHub. It includes:

- typed content collections
- dark-first and light themes
- archive and tag routes
- browser-local search
- RSS, JSON Feed, sitemap, robots, and BlogPosting structured data
- issue-backed comments loaded on demand
- local licensed photography with visible attribution
- reproducible migration of twelve authored posts from older repositories
- content linting, build validation, and GitHub Pages deployment

## Develop

```bash
npm ci
npm run dev
```

## Validate

```bash
npm run build
```

## Create a draft

```bash
npm run new -- "Working title"
```

Future agents should begin with [`AGENTS.md`](./AGENTS.md) and [`docs/EDITORIAL_STYLE.md`](./docs/EDITORIAL_STYLE.md).
