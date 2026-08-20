# Architecture and design decisions

## Why Astro

The blog is a set of durable documents, not an application pretending to be a document. Astro emits static HTML by default, validates structured Markdown with content collections, and permits isolated JavaScript without shipping a site-wide runtime. The repository deliberately keeps one production dependency: Astro.

## Information architecture

- `/` — editorial home and latest work
- `/posts/<slug>/` — permanent article URLs
- `/archive/` — date-first complete index
- `/tags/` and `/tags/<tag>/` — subject browsing
- `/search/` — browser-local static search
- `/rss.xml`, `/feed.json`, `/sitemap.xml` — machine-readable publication surfaces

## Type and measure

Article prose uses a platform serif stack at 17–19 px with 1.72 line height. The reading column is 45 rem, which generally lands in the 60–72 character range. Interface text uses the platform sans stack. No font request blocks first paint.

## Breakpoints

Breakpoints follow content failure, not branded device categories:

- `45rem`: full navigation and two-column lists become comfortable.
- `64rem`: three-column archive cards and wider metadata fit without compression.
- `80rem`: the table of contents can occupy its own rail without shrinking the 45 rem reading measure.

## Performance budgets

- No site-wide JavaScript framework.
- Theme script executes inline before paint and is under 0.5 KB compressed.
- Search index loads only on `/search/` after focus or submission.
- GitHub comments load only after a button press.
- Hero images are 1600×900 WebP with explicit dimensions.
- No third-party analytics, ads, or embeds in the default page path.
