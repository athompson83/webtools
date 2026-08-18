# Codex Readiness

## Purpose

This document is the human-readable companion to `CODEX_HANDOFF.json`. It records what source is already present, what remains intentionally uncertified, and the highest-risk items Codex should address first.

## Current implementation state

### Portfolio foundation

Present:

- pnpm multi-workspace root configuration
- per-domain app architecture
- `portfolio/sites.json` as the site/domain manifest
- GroundExact app
- one-command future-site scaffolding via `pnpm create:site`
- source-level portfolio/domain validation
- post-build domain/canonical/sitemap validation
- shared site configuration package
- shared calculator core
- shared tool lifecycle/catalog package
- shared browser/query-state tool runtime
- shared analytics event and consent-aware adapter contract
- shared compliance/runtime-data contract
- shared SEO/canonical/schema/robots/sitemap helpers
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

Every engine has a golden-case test. Validation/negative coverage has also been expanded for high-risk inputs including supplier coverage, label rates, material density, waste percentages, wall/product dimensions, gate widths, and integer component counts.

### GroundExact public pages

All ten calculator pages now exist and are registered as **`page-ready`**:

- Mulch
- Gravel / Stone
- Topsoil
- Sod
- Pavers
- Retaining Wall
- Fence
- Fertilizer
- Grass Seed
- Cubic Yard

None is certified `live` because repository execution and browser release gates have not yet been run in the authoring environment.

Static informational/legal copy is implemented via `src/content/static-pages.ts` and `src/pages/[slug].astro`.

### GroundExact shared page behavior

`ToolPageLayout.astro` now provides:

- automatic `noindex,follow` for every calculator not marked `live`
- WebPage and BreadcrumbList structured data
- copy-calculation-link action
- print action
- provider-neutral reserved ad placement that renders only when ads are actually enabled
- related-tool links generated only from certified `live` tools

`BaseLayout.astro` provides:

- canonical URL generation from site config
- Organization and WebSite structured data
- OpenGraph metadata
- site-name/description rendering from configuration instead of duplicated brand strings

### Publication safety

GroundExact no longer uses route-driven automatic sitemap generation.

`/sitemap.xml` is generated from:

- the homepage
- approved static/informational/legal pages
- tools whose registry status is exactly `live`

All `page-ready` calculator routes physically exist for QA but are automatically `noindex` and are absent from the sitemap.

The post-build validator also rejects a built page that is `noindex` but appears in the sitemap, foreign portfolio origins in built HTML, foreign sitemap origins, and foreign canonical origins.

### Runtime/privacy/monetization state

`src/config/runtime-data.ts` records GroundExact's actual runtime behavior:

- calculator inputs are not server-stored
- file uploads are not accepted
- analytics provider comes from site config and is currently `none`
- advertising provider comes from site config and is currently `none`
- affiliate tracking is currently disabled

Ads remain disabled. `AdSlot.astro` exists only as a provider-neutral layout boundary and does not load an advertising provider.

## No green-build claim

The authoring environment used for repository population could write/read GitHub through the connector but could not obtain and execute a normal local repository checkout. Therefore this work does **not** claim that the current head has executed successfully.

Specifically, no claim is being made here that the following have passed:

- `pnpm install`
- `pnpm validate:portfolio`
- lint
- typecheck
- Vitest
- Node script tests
- Astro build
- `pnpm validate:dist`
- browser QA

Codex must treat all source as **uncertified until execution proves otherwise**.

## First blocking milestone

Before adding product scope or promoting any tool to `live`:

1. Clone/open the repository locally.
2. Confirm expected Node/corepack environment.
3. Run `corepack enable`.
4. Inspect lockfile status.
5. Run `pnpm install` intentionally.
6. If the lockfile is missing, create and review it, commit it, and then use frozen-lockfile installs.
7. Run `pnpm validate:portfolio`.
8. Run lint.
9. Run typecheck.
10. Run all tests.
11. Run build.
12. Run `pnpm validate:dist`.
13. Repair every baseline failure without broad architectural drift.
14. Start the GroundExact dev server and visually verify all ten page-ready routes.

## Known items Codex should expect to inspect

### 1. Lockfile/deterministic install

Initial source population did not create a pnpm lockfile through a verified install. Codex should inspect the repository state and intentionally create/update the lockfile if missing. Once verified, CI should switch from `--frozen-lockfile=false` to frozen-lockfile behavior.

### 2. Shared TypeScript base

`tsconfig.base.json` was added while expanding shared packages. Confirm all package TypeScript configurations behave correctly with the current compiler and Astro configuration before normalizing other tsconfigs onto it.

### 3. Browser scripts are partially normalized

Mulch and Fence already use `@webtools/tool-runtime` for form/query-state behavior and use their production calculation modules. Other pages call production calculation modules but still contain repeated hydration/query-state code. Refactor only after the baseline is green and preserve existing behavior.

### 4. Structured data needs rendered-output verification

Organization, WebSite, WebPage, and BreadcrumbList schemas are wired. Validate the rendered JSON-LD and canonical URLs after the first successful build. Do not add schema merely to increase schema count.

### 5. Publication lifecycle

No tool should currently be assumed certified `live`. `page-ready` is intentionally distinct from `live` because build/browser gates have not been executed in the authoring environment.

### 6. Sitemap/noindex semantics are now explicit

Source code implements fail-safe prelaunch behavior: only `live` tools enter the sitemap and non-live tools are `noindex`. Verify this in built output rather than redesigning it unless execution exposes a defect.

### 7. Legal pages are implementation drafts

The pages intentionally avoid pretending currently disabled analytics/ads are already active, but monetized production launch still needs a final runtime-data-inventory-to-policy comparison and appropriate legal/business review.

### 8. Ads are intentionally disabled

Do not enable AdSense merely because monetization code and an ad-slot component exist. Site config remains the authority; real provider IDs, consent behavior, and matching disclosures must exist first.

### 9. New-site factory is implemented but uncertified

The CLI is:

```bash
pnpm create:site -- --key <site-key> --name "Site Name" --domain https://example.com --contact-email hello@example.com
```

It creates an independent Astro app, disables search indexing by default, registers the site in `portfolio/sites.json`, and supplies domain-specific config, robots, sitemap, layout, homepage, and styles. Run it in a disposable branch/temp copy before relying on it for the second production property.

## Formula/domain review notes

### Gravel

Weight estimation requires a user-entered material density. Do not prefill one density as a universal fact. Any example density must remain clearly labeled as an example condition only.

### Fertilizer

Application rate is taken from the product label entered by the user. Do not recommend a universal rate.

### Grass seed

Use the same principle as fertilizer: user-entered product label rate and package weight.

### Sod

Roll and pallet coverage are supplier/product inputs. Do not standardize them globally.

### Fence

Current engine models a straight run and can subtract gate widths. The public page explicitly communicates scope and does not model arbitrary corners, terrain, or installation engineering.

### Retaining wall

Current engine estimates courses, blocks, and caps from entered unit dimensions. It is not an engineering/stability/foundation/design tool. The public page explicitly says quantity is not structural design.

## Recommended next sequence after baseline is green

1. Fix any install/workspace/type/build failures.
2. Commit and freeze deterministic lockfile state.
3. Run every calculation/unit/script test.
4. Browser-certify all ten page-ready tools.
5. Validate built `robots.txt`, `sitemap.xml`, canonicals, structured data, and `noindex` behavior.
6. Refactor repetitive page query-state code onto `@webtools/tool-runtime` only if the green baseline remains stable.
7. Wire analytics event calls through `@webtools/analytics` while keeping the provider `none`.
8. Perform accessibility and responsive QA.
9. Promote tools to `live` one-by-one only when each publication gate passes.
10. Confirm each promotion adds the tool to sitemap and related-tool discovery automatically.
11. Run the new-site factory in a disposable environment and certify it before creating the second portfolio property.
12. Keep advertising disabled until provider/consent/legal configuration is ready.

## Definition of a useful Codex report

Do not report only that work is "done." Include:

- exact head SHA
- changed files
- commands executed
- pass/fail counts
- routes visually checked
- generated sitemap/robots findings
- known limitations
- any status promotions (`page-ready` → `live`)
- next recommended action
