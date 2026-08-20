# Lighthouse and quality target

The release target is 100 in Performance, Accessibility, Best Practices, and SEO on the representative static pages below, tested in both themes where relevant:

- `/blog/`
- latest image-heavy article
- legacy code-heavy article
- `/blog/search/` before and after a query
- `/blog/archive/`

A score is evidence from a particular run, not a permanent property. Every release should also check:

- no layout shift from images (explicit width/height)
- keyboard access and focus visibility
- 200% zoom without horizontal page scrolling, excluding code/tables
- reduced-motion behavior
- dark/light contrast
- broken internal links
- RSS, JSON Feed, sitemap, canonical URLs, and structured data
- 320 px, 768 px, and 1440 px viewports

No claim of “100 on every page” should be published until the deployed site is audited; third-party GitHub API and browser extensions can also affect a local run.
