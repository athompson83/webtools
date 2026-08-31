# AGENTS.md

## Repository mission

This repository powers a portfolio of independent utility websites. Each application must remain independently deployable, branded, crawlable, testable, and legally accurate while reusing shared engineering packages.

If you are starting implementation work, read `CODEX_HANDOFF.json` immediately after this file.

## Non-negotiable architecture rules

1. Each production domain lives in its own `apps/<site>` directory.
2. Shared packages must be domain-agnostic. Do not put GroundExact-specific copy, colors, SEO titles, or vertical-specific formulas into generic packages unless the formula is truly cross-site infrastructure.
3. Do not route multiple brands from one runtime by hostname unless explicitly approved. Prefer one deployment project per app.
4. Keep applications static-first. Do not add a database, authentication, API server, CMS, queues, or background jobs without an explicit product requirement.
5. Tool formulas belong in testable TypeScript modules, never duplicated inside UI templates or page scripts.
6. Tool result pages must render useful explanatory text, not only graphics/canvas output.
7. Query parameters may represent shareable tool inputs, but parameterized variants must canonicalize to the base tool URL unless an explicit SEO decision says otherwise.
8. Do not generate thin location/query/material permutation pages for SEO.
9. Every site must have a data inventory and legal pages matching actual behavior.
10. Ads must never obscure primary tool functionality or cause avoidable layout shift.
11. Do not create an all-to-all reciprocal footer linking every portfolio property.
12. Do not claim a page is live merely because source files exist.

## Tool lifecycle

GroundExact tools move through these states:

`planned → engine-ready → page-ready → live`

- `planned`: implementation incomplete.
- `engine-ready`: calculation module exists but public page is incomplete.
- `page-ready`: calculation module and public page exist but repository/build/browser/publication gates are not yet certified.
- `live`: all required publication gates were actually executed and passed at the exact commit.

`apps/groundexact/src/tools/registry.ts` is the status authority.

Never promote a tool to `live` without satisfying `docs/seo/groundexact-page-map.md`.

## Development standards

- Use TypeScript with strict mode.
- Use test-driven development for new behavior and defects.
- Prefer small pure functions and dependency-free calculation code.
- Validate all numeric inputs; reject NaN, infinity, impossible negatives, zero where zero is invalid, and values outside documented ranges.
- Round only at presentation/order boundaries. Preserve intermediate precision.
- Every calculator requires golden-case tests plus meaningful invalid-input/edge tests. Add unit-conversion tests when the tool exposes multiple units.
- Accessibility is a release criterion: semantic labels, keyboard usability, focus states, reduced motion, contrast, and meaningful error text.
- Mobile is the primary calculator breakpoint.
- No hidden tracking before consent where consent is legally required.
- Do not invent product rates, densities, packaging coverage, prices, statistics, testimonials, users, or sources.

## Known baseline debt to resolve before copying patterns

The existing Mulch page predates the stricter formula-boundary rule. Its browser script currently duplicates the mulch formula instead of importing/calling `src/tools/mulch/calculate.ts`.

**Required baseline fix:** refactor the Mulch page to use the production calculation module, preserve behavior with tests, and then use that corrected pattern for subsequent pages.

Do not copy the duplicated formula pattern.

## SEO / AI discovery rules

Every certified indexable tool page requires:

- unique `<title>` and meta description
- canonical URL
- one clear H1
- working tool near the top of the page
- concise answer/explanation near the tool
- visible usage guidance
- methodology/formula section
- assumptions and limitations
- at least one verified worked example
- relevant FAQs only when genuinely useful
- related-tool links only to relevant certified-live tools
- source/review information where external facts are used
- structured data only when truthful, visible where applicable, and currently supported

Keep `robots.txt`, sitemap generation, OAI-SearchBot policy, GPTBot policy, and Bing/IndexNow readiness explicit in each app.

Do not create LLM-only hidden content or parallel pages whose only purpose is AI indexing.

## Monetization rules

- The tool must work without interacting with an ad.
- Ads default to disabled until provider IDs, consent behavior, and disclosures are configured.
- Reserve ad dimensions to reduce layout shift.
- Do not place ads so they appear to be form controls, result controls, download buttons, or navigation.
- Affiliate links must be disclosed and tagged appropriately.
- Use shared provider-neutral contracts instead of embedding vendor calls throughout calculator source.
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
- universal material volume / cubic yards

Do not expand MVP into contractor CRM, accounts, saved projects, ecommerce, supplier APIs, AI chat, or live pricing unless explicitly requested.

<!-- BEGIN ECONOMICAL CI -->
## Economical CI (Codex and Claude)

These rules apply equally to Codex and Claude.

- Inspect changed files before testing. Run focused package/app checks first and run the full `pnpm check` gate when application code, shared packages, scripts, configuration, dependencies, generated output, or deployment behavior changed.
- Documentation-only changes do not require installing dependencies or rebuilding every site. Review the rendered/diffed Markdown and run only an applicable documentation or formatting check.
- Record exact local commands and results in the pull request or handoff. Do not push speculative fixes solely to obtain GitHub Actions feedback.
- Read complete failing job and step logs, compare the failure with recent commits and a working repository pattern, and identify the root cause before changing code or workflow configuration.
- Classify failures as deterministic code/configuration, base-branch drift/conflict, flaky/transient, dependency/service outage, secret/permission boundary, or obsolete workflow.
- Do not manually rerun failed Actions or create empty commits to retrigger CI before the root cause is known. Allow at most one targeted rerun when evidence specifically indicates a transient external failure.
- Use a draft pull request while iterating; mark it ready only after selected local checks pass so hosted runners are not consumed on each work-in-progress push.
- Preserve portfolio validation, lint, typecheck, tests, builds, distribution validation, legal/data-inventory checks, and independent-deployment assurance whenever their risk boundary changed. Cost reduction must not weaken those gates.
<!-- END ECONOMICAL CI -->

## Required verification before claiming completion

At minimum run and report exact results for:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For UI changes, also verify the rendered site in a browser at desktop and mobile widths and check the console for errors.

GroundExact target widths include approximately 360, 390, 768, 1024, and 1440 CSS pixels.

If you cannot execute a gate, report it as **not executed**. Never infer passing status from source inspection.
