# WebTools Monorepo Architecture

## Objective

Support many independently branded tool sites from one repository without coupling their domains, SEO, visual identity, analytics, or deployments.

## Deployment topology

Each `apps/<site>` folder maps to one deployment project and one production domain.

Example:

```text
apps/groundexact     -> groundexact.com
apps/future-word     -> futureword.com
apps/future-business -> futurebusiness.com
```

Do not deploy the repository root as the production website. Configure each host to build only its application workspace.

## Shared package boundaries

### `@webtools/calculator-core`
Pure math, units, waste-factor utilities, quantity rounding, formatting helpers, and reusable result types. No DOM, Astro, brand copy, analytics, or external APIs.

### `@webtools/site-config`
Types and helpers for per-domain identity, URLs, contact/legal metadata, indexing policy, analytics, and ads.

### `@webtools/seo`
Framework-agnostic helpers for canonicals, metadata, JSON-LD objects, sitemap records, and robots directives.

### `@webtools/ui`
Low-level accessible UI primitives/tokens only. Site-specific visual identity remains in each app.

### `@webtools/analytics`
Typed event contracts. Provider integrations should be thin adapters and should not leak provider-specific calls throughout applications.

### `@webtools/ads`
Reserved-layout ad slot primitives. Site apps decide whether and where a slot is enabled.

### `@webtools/compliance`
Data inventory models, consent categories, disclosure helpers, and shared legal-page composition primitives. Legal text must still be configured per property and reviewed against actual behavior.

## Site-level layout

```text
apps/<site>/
  astro.config.mjs
  package.json
  tsconfig.json
  site.config.ts
  public/
    robots.txt
    favicon.svg
  src/
    components/
    content/
    layouts/
    lib/
    pages/
      tools/
    styles/
    tools/
      <tool>/
        calculate.ts
        definition.ts
        content.ts
        calculate.test.ts
```

## Tool contract

A calculator consists of:

1. A typed definition describing slug, name, summary, input fields, units, assumptions, related tools, and SEO metadata.
2. A pure `calculate()` function with no UI side effects.
3. Tests containing known examples and boundary cases.
4. Page content containing instructions, methodology, worked examples, sources/assumptions, and relevant FAQs.
5. A UI that translates the raw calculation result into an actionable recommendation.

## Domain isolation

Domain names are never inferred from runtime host headers. `site.config.ts` is the source of truth. Production builds should fail when a required production origin is missing or malformed.

This prevents one site's canonical URLs, structured data, ad IDs, analytics IDs, or legal identity from leaking into another site.

## Cross-site linking

No global all-sites footer farm. A site may include a single neutral parent-property link. Cross-site deep links should exist only when they materially help a user complete a task.

## Data strategy

Initial deterministic calculators require no persistent user data. Shareable calculations may serialize non-sensitive inputs into URL query parameters. Do not persist user inputs server-side without an approved data-use case and updated legal inventory.

## SEO strategy

Every site owns its own sitemap, canonical origin, robots directives, schema, Search Console property, Bing Webmaster Tools property, analytics property, and IndexNow key when enabled.

Parameterized calculator states are user convenience URLs, not unique SEO pages.

## Release strategy

MVP -> Beta -> Production.

A site does not graduate merely because it builds. It must pass formula correctness, accessibility, responsive browser QA, metadata/canonical validation, sitemap/robots review, privacy/data inventory review, performance review, and content quality review.
