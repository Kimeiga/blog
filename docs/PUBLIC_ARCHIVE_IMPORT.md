# Public archive import

Verified: 2026-08-22

## Source counts

| Source | Expected | Actual at source | Imported/current | Skipped duplicates | Slug collisions | Missing assets | Attribution unresolved |
|---|---:|---:|---:|---:|---:|---:|---:|
| Life of Kimeiga / `blog-old` | 9 | 9 | 9 | 0 | 0 | 0 | 0 |
| WordPress posts | 19 | 19 | 19 | 0 | 0 | 0 | 1 |
| Lonely-CLA page | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| delta galaxy Substack | 14 | 14 | 14 | 0 | 0 | 0 | 0 |
| LeetCode archive | 3 | 3 | 3 | 0 | 0 | 0 | 0 |
| Current original blog posts | 2 | 2 | 2 | — | 0 | 0 | 0 |
| **Canonical total** | **48** | **48** | **48** | **0** | **0** | **0** | **1** |

The canonical collection contains 48 posts. Canonical slug validation reports no collisions among the 48 generated article routes.

## Source notes

### Life of Kimeiga

Nine Jekyll posts from 2018–2019 are present under `src/content/posts/legacy/`. Dates, titles, bodies, and original hero placement are preserved. The separate source site remains an archive deployment; it is not a second canonical import.

### WordPress and Lonely-CLA

Nineteen WordPress posts and the standalone Lonely-CLA page are present under `src/content/posts/imported/wordpress/`. The original 306 media files remain checked in. SHA-256 checksums were recorded before generating 297 separately named live WebP derivatives.

One WordPress meme attachment has no recoverable creator or reuse license. Its original binary is preserved but no longer appears in live HTML; a licensed archive photograph replaces it. The Japanese-language tweet screenshot is visibly credited to its author and retained as a contextual quotation.

### delta galaxy

The rendered archive currently contains 14 public `/p/` entries, not the previously reported 12. The two additional public posts are:

- `the-love-of-language-and-the-language` — 43082302
- `the-supreme-lack-of-meaning-in-life` — 43080730

All 14 were imported. [The completeness report](./SUBSTACK_IMPORT_VERIFICATION.md) records exact title/date checks, normalized full-body comparisons, word counts, and body image/heading counts for every source URL.

Two original Substack images had no portable reuse permission: Crazy Ivory’s all-rights-reserved cat photograph and an NYC DOT Street Design Manual image. Both originals remain in the archival media set and both live placements use licensed replacements with visible credits.

### LeetCode

Three historical solution posts are present. The three external Perfect Rectangle diagrams were downloaded for archival evidence and removed from live HTML; locally authored SVG redraws preserve the examples without republishing LeetCode pixels.

## Media state

- Historical pre-derivative checksum entries: 335
- Image files audited after derivatives and replacements: 683
- Licensed replacement photographs added: 17
- Broken local media references: 0
- Remote article image loads: 0

The canonical archive is checked into Git. Archive import automation is manual-only; it does not rescrape sources on pushes.
