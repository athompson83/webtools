# Codex Readiness

## Purpose

This document is the human-readable companion to `CODEX_HANDOFF.json`. It records what source is already present, what remains intentionally uncertified, and the highest-risk items Codex should address first.

## Current implementation state

### Portfolio foundation

Present:

- pnpm multi-workspace root configuration
- per-domain app architecture
- GroundExact app
- future-site `.example` scaffold
- shared site configuration package
- shared calculator core
- shared analytics event contract
- shared SEO/canonical/schema/robots helpers
- shared provider-neutral monetization helpers
- portfolio SEO/AEO governance
- multi-domain deployment contract
- legal/data-inventory template
- CI workflow source

### GroundExact calculator engines

All ten MVP calculation modules exist:

- mulch
- gravel / stone
- topsoil
- sod
- pavers
- retaining wall
- fence
- fertilizer
- grass seed
- cubic yards

Every engine has at least one golden-case test. Some still need expanded invalid/edge coverage before release.

### GroundExact public pages

Page-ready source exists for:

- Mulch
- Gravel / Stone
- Topsoil
- Fertilizer
- Cubic Yard

Engine-ready only:

- Sod
- Pavers
- Retaining Wall
- Fence
- Grass Seed

Static informational/legal copy is implemented via `src/content/static-pages.ts` and `src/pages/[slug].astro`.

## No green-build claim

The authoring environment used for the initial repository population could write/read GitHub through the connector but could not resolve GitHub from its local shell environment. Therefore:

- `pnpm install` was not executed locally here.
- lint was not executed locally here.
- typecheck was not executed locally here.
- Vitest was not executed locally here.
- Astro build was not executed locally here.
- browser QA was not executed locally here.

Codex must treat all source as **uncertified until execution proves otherwise**.

## First blocking milestone

Before implementing another page:

1. Clone/open repository locally.
2. Confirm expected Node/corepack environment.
3. Run `corepack enable`.
4. Inspect lockfile status.
5. Run deterministic install.
6. Run lint.
7. Run typecheck.
8. Run tests.
9. Run build.
10. Repair every baseline failure without broad architectural drift.
11. Start dev server and visually verify existing page-ready routes.

## Known items Codex should expect to inspect

### 1. Mulch formula duplication

`apps/groundexact/src/pages/tools/mulch-calculator.astro` currently duplicates calculation math in its browser script even though `src/tools/mulch/calculate.ts` exists.

Required repair: browser UI imports/calls production module. Preserve expected output and query-state behavior.

### 2. Lockfile/deterministic install

Initial source population did not create a pnpm lockfile through a verified install. Codex should inspect the repository state and intentionally create/update the lockfile if missing.

### 3. Shared TypeScript base

`tsconfig.base.json` was added while expanding shared packages. Confirm all package TypeScript configurations behave correctly with the current compiler and Astro configuration before normalizing other tsconfigs onto it.

### 4. Structured data not fully wired

`@webtools/seo` contains helpers, but BaseLayout/ToolPageLayout do not yet consistently use all helper outputs. Do not add schema for its own sake. Wire truthful Organization/WebSite/WebPage/Breadcrumb data after baseline certification.

### 5. Publication lifecycle

No tool should currently be assumed certified `live`. `page-ready` is intentionally distinct from `live` because build/browser gates have not been executed in the authoring environment.

### 6. Sitemap release semantics

Astro sitemap behavior must be inspected after build. Page-ready routes physically exist, so Codex must decide and implement the safest prelaunch/release behavior so unfinished or uncertified content is not represented as certified indexable content. Prefer an explicit source-of-truth mechanism over manual duplicate allowlists.

### 7. Legal pages are implementation drafts

The pages intentionally avoid pretending currently disabled analytics/ads are already active, but monetized production launch still needs a final data-inventory-to-policy comparison and appropriate legal/business review.

### 8. Ads are intentionally disabled

Do not enable AdSense merely because `@webtools/monetization` exists. Site config remains the authority; consent and disclosure behavior must exist first.

## Formula/domain review notes

### Gravel

Weight estimation requires a user-entered material density. Do not prefill one density as universal. The worked example clearly identifies 100 lb/ft³ as an example condition only.

### Fertilizer

Application rate is taken from the product label entered by the user. Do not recommend a universal rate.

### Grass seed

Use the same principle as fertilizer: user-entered product label rate and package weight.

### Fence

Current engine models a straight run and can subtract gate widths. Public page must clearly communicate scope and not imply arbitrary corner/terrain optimization.

### Retaining wall

Current engine estimates courses, blocks, and caps from entered unit dimensions. It is not an engineering/stability/foundation/design tool. Public copy must not imply structural adequacy.

## Recommended next implementation sequence after baseline is green

1. Refactor Mulch onto production calculation module.
2. Add invalid-input tests to remaining engines.
3. Browser-certify the five page-ready routes.
4. Decide sitemap/noindex behavior for `page-ready` routes before any public deployment.
5. Finish Sod page.
6. Finish Grass Seed page.
7. Extract shared coverage-tool UI only if Sod/Fertilizer/Grass Seed prove the abstraction.
8. Finish Paver page.
9. Finish Retaining Wall page.
10. Finish Fence page.
11. Wire structured data and analytics event hooks.
12. Add print/share primitives.
13. Add monetization slot components but keep them inactive.
14. Run release certification.

## Definition of a useful Codex report

Do not report only that work is "done." Include:

- exact head SHA
- changed files
- commands executed
- pass/fail counts
- routes visually checked
- known limitations
- any status promotions (`engine-ready` → `page-ready` → `live`)
- next recommended action
