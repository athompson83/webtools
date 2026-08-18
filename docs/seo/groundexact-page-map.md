# GroundExact SEO Page Map

## Indexable MVP URLs

### Core

- `/` — brand/category hub
- `/about`
- `/methodology`
- `/contact`

### Calculator pages

A page file existing in the repository does not make a calculator certified for public/indexable release.

Status meanings:

- **page ready** — calculation engine and user-facing page exist; build/browser/publication certification still required.
- **engine ready** — calculation engine exists; user-facing page still required.
- **live** — all publication gates were actually executed and passed.

Current state:

- `/tools/mulch-calculator` — page ready; requires baseline/build certification and formula-deduplication refactor
- `/tools/fertilizer-calculator` — page ready; uses production engine; requires baseline/build/browser certification
- `/tools/cubic-yard-calculator` — page ready; uses production engine; requires baseline/build/browser certification
- `/tools/gravel-calculator` — engine ready; page still required
- `/tools/topsoil-calculator` — engine ready; page still required
- `/tools/sod-calculator` — engine ready; page still required
- `/tools/paver-calculator` — engine ready; page still required
- `/tools/retaining-wall-calculator` — engine ready; page still required
- `/tools/fence-calculator` — engine ready; page still required
- `/tools/grass-seed-calculator` — engine ready; page still required

### Legal/disclosure

- `/privacy`
- `/terms`
- `/cookies`
- `/advertising-disclosure`
- `/accessibility`

These routes contain implementation drafts and must be checked against the actual provider/data configuration plus legal review needs before monetized production launch.

## Calculator page content contract

Every calculator page must contain, in this order where practical:

1. Specific H1 matching the tool intent.
2. One-sentence value proposition.
3. Working calculator above the primary long-form explanation.
4. Clear result hierarchy.
5. Three-to-five-step usage instructions or equivalently clear inline guidance.
6. Formula/methodology in crawlable text.
7. Explanation of non-universal assumptions.
8. At least one verified worked example.
9. Genuine FAQs only when they help the user.
10. Related tools that are already certified live.
11. Last-reviewed date.
12. Sources when external claims or rates are used.

## Query parameter policy

Calculator state may use query parameters for sharing, e.g.:

`/tools/mulch-calculator?area=327&depth=3&waste=5&bag=2`

Rules:

- Canonical URL always points to the clean calculator URL.
- Do not add query-state URLs to XML sitemaps.
- Do not create server-rendered keyword variants based on calculator values.
- Shared URLs must reproduce the state but remain the same underlying document.

## Search intent clusters

### Material volume

Mulch, topsoil, gravel, cubic yards.

Primary intent: `how much [material] do I need` and material-specific calculator terms.

### Surface coverage

Sod, grass seed, fertilizer.

Primary intent: coverage and quantity to purchase. Product label rates must remain user inputs where non-universal.

### Installed units

Pavers, retaining wall, fence.

Primary intent: translate project dimensions into countable units and purchase quantities.

## Internal linking

Recommended contextual links after both endpoints are certified live:

- mulch ↔ cubic yards ↔ topsoil
- gravel ↔ cubic yards ↔ pavers
- sod ↔ grass seed ↔ fertilizer
- pavers ↔ gravel
- retaining wall ↔ gravel
- fence should link only to genuinely relevant later tools or the calculator hub until then

Do not force every calculator to link to every other calculator.

## Supporting content strategy

Do not launch dozens of generic blog posts for volume. Supporting guides should exist only when they solve a distinct task the calculator cannot fully answer.

Potential later guides after search-query evidence:

- how to measure an irregular landscape bed
- bulk material vs bags: how to compare delivered cost
- how supplier order increments affect quantity
- how to read fertilizer coverage/application information from a product label
- measuring fence runs with gates and corners

These are not MVP requirements.

## Metadata pattern

Titles should be concise and intent-led:

`Mulch Calculator: Cubic Yards & Bags | GroundExact`

Descriptions should explain the useful result rather than repeat keywords:

`Estimate mulch from area and depth, add an adjustable overage, and compare the rounded bulk order with bag equivalents.`

## Structured data

Allowed when truthful and visible:

- Organization
- WebSite
- BreadcrumbList
- WebPage

FAQ structured data should only be emitted when the page visibly contains the same FAQs and when its use complies with current search-engine guidance at implementation time.

## Publication gate

A calculator may move to `live` only after:

- UI uses the production calculation module rather than duplicating the formula.
- Golden-case test exists and passes.
- Invalid-input behavior is tested and passes.
- Full repository lint/typecheck/test/build gate passes at the exact commit.
- Browser verification confirms the calculator works at target mobile and desktop widths.
- Mobile flow is usable and keyboard flow has no material blocker.
- Canonical URL is clean.
- Sitemap/robots behavior is verified.
- Page has methodology and reviewed date.
- No invented supplier/product claims appear.
- No broken related-tool links exist.
