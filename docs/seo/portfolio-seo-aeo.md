# Portfolio SEO, AEO & LLM Discovery Standards

## Principle

Each site must earn search visibility independently. Shared engineering is encouraged; duplicate or lightly reworded content is not.

## Page eligibility

Only index a page when it contains a complete, useful tool or substantial supporting content. Do not publish placeholder calculator pages to production.

## Canonicals

- Canonical URLs always use the exact site's production origin.
- Query-string calculator states canonicalize to the base calculator URL.
- Never canonicalize one portfolio site to another.

## Page structure

Every calculator page should include, in crawlable HTML:

1. Clear H1 matching the user's task.
2. Working calculator.
3. Short instructions.
4. Result explanation.
5. Formula/methodology.
6. Assumptions and edge cases.
7. Worked example.
8. Genuine FAQs when useful.
9. Related tools.
10. Last reviewed date.
11. Sources where external claims are used.

## Structured data

Start conservatively with:

- Organization
- WebSite
- BreadcrumbList

Only add FAQPage or other schema if the visible page content and current search-engine policies support it. Never generate schema for content not visible to users.

## AI/LLM discovery

- Keep OAI-SearchBot explicitly allowed unless site policy changes.
- GPTBot policy is a separate business decision and is disabled by default in GroundExact.
- Use semantic headings, concise definitions, tables, equations, examples, and explicit assumptions.
- Keep important explanatory content server-rendered/static, not hidden behind client-only rendering.
- Track AI referral traffic when analytics is enabled.
- Treat `llms.txt` as optional experimentation, not a substitute for crawlable site architecture.

## Internal linking

Link by user workflow and topical relevance. Examples:

- Mulch -> cubic-yard calculator
- Gravel -> cubic-yard calculator
- Pavers -> retaining wall when contextually relevant

Do not inject keyword-rich links to every portfolio property into every footer.

## Cross-property links

One neutral parent-company/portfolio link is acceptable. Deep cross-property links require user relevance. Do not build reciprocal link rings.

## Content quality

Prohibited:

- programmatic city pages without unique utility/data
- one page per trivial keyword variation
- copied competitor FAQs
- fabricated statistics
- invented product application rates
- AI-generated filler added solely to increase word count

## Sitemap and crawling

Each app owns:

- sitemap
- robots.txt
- canonical origin
- Search Console property
- Bing Webmaster Tools property
- IndexNow key/config if enabled

## Measurement

Track at minimum when analytics is enabled:

- organic landing sessions
- tool starts/calculations
- calculator completion rate
- related-tool clicks
- return visits
- print/share actions
- affiliate clicks
- revenue/page RPM once ads are enabled
- search query impressions/clicks
- AI assistant referrals when identifiable

## Launch indexing gate

Before requesting indexing:

- no placeholder tool pages
- canonical tags verified
- title/description uniqueness checked
- robots and sitemap validated
- structured data validated
- mobile usability checked
- internal links contain no broken targets
