# AGENTS.md

## Repository mission

This repository powers a portfolio of independent utility websites. Each application must remain independently deployable, branded, crawlable, testable, and legally accurate while reusing shared engineering packages.

## Non-negotiable architecture rules

1. Each production domain lives in its own `apps/<site>` directory.
2. Shared packages must be domain-agnostic. Do not put GroundExact-specific copy, colors, SEO titles, or formulas into generic packages.
3. Do not route multiple brands from one runtime by hostname unless explicitly approved. Prefer one deployment project per app.
4. Keep applications static-first. Do not add a database, authentication, API server, CMS, queues, or background jobs without an explicit product requirement.
5. Tool formulas belong in testable TypeScript modules, never embedded directly inside UI templates.
6. Tool result pages must render useful explanatory text, not only graphics/canvas output.
7. Query parameters may represent shareable tool inputs, but parameterized variants must canonicalize to the base tool URL unless an explicit SEO decision says otherwise.
8. Do not generate thin location/query/material permutation pages for SEO.
9. Every site must have a data inventory and legal pages matching actual behavior.
10. Ads must never obscure primary tool functionality or cause avoidable CLS.

## Development standards

- Use TypeScript with strict mode.
- Prefer small pure functions and dependency-free calculation code.
- Validate all numeric inputs; reject NaN, infinity, impossible negatives, and values outside documented ranges.
- Round only at presentation/order boundaries. Preserve intermediate precision.
- Every calculator requires golden-case tests, edge tests, and unit-conversion tests.
- Accessibility is a release criterion: semantic labels, keyboard usability, focus states, reduced motion, contrast, and meaningful error text.
- Mobile is the primary calculator breakpoint.
- No hidden tracking before consent where consent is legally required.

## SEO / AI discovery rules

Every indexable tool page requires:

- unique `<title>` and meta description
- canonical URL
- one clear H1
- concise answer/explanation near the tool
- visible instructions
- methodology/formula section
- assumptions and limitations
- at least one worked example
- relevant FAQs only when genuinely useful
- related-tool links
- source/review information where external facts are used
- structured data only when truthful and supported

Keep `robots.txt`, sitemap generation, OAI-SearchBot policy, and Bing/IndexNow readiness explicit in each app.

## Monetization rules

- The tool must work without interacting with an ad.
- Reserve ad dimensions to reduce layout shift.
- Do not place ads so they appear to be form controls, result controls, download buttons, or navigation.
- Affiliate links must be disclosed and tagged appropriately.
- Do not implement speculative monetization integrations during MVP.

## GroundExact scope

GroundExact is the first site and follows: **Measure → Calculate → Adjust → Buy**.

MVP calculators:

- mulch
- gravel / stone
- topsoil
- sod
- pavers
- retaining wall
- fence materials
- fertilizer coverage
- grass seed
- universal material volume

Do not expand MVP into contractor CRM, accounts, saved projects, ecommerce, supplier APIs, AI chat, or live pricing unless explicitly requested.

## Required verification before claiming completion

Run, and report exact results for:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For UI changes, also verify the rendered site in a browser at desktop and mobile widths and check the console for errors.
