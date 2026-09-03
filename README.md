<div align="center">

# WebTools

**A static-first portfolio of focused utility websites, each with its own domain, brand, SEO strategy, and monetization boundary.**

![Stage](https://img.shields.io/badge/stage-foundation%20%2B%20first%20property-2563EB?style=flat-square)
![Astro](https://img.shields.io/badge/Astro-static--first-2563EB?style=flat-square&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-2563EB?style=flat-square&logo=typescript&logoColor=white)
![SEO](https://img.shields.io/badge/discovery-SEO%20%2B%20AEO-2563EB?style=flat-square)

</div>

> [!NOTE]
> **GroundExact** is the first property. Future sites should be added only when they solve a coherent problem for a defined audience—not to create thin pages or clone the same experience across domains.

## Portfolio model

Each public property is independently deployable and owns its domain, brand, metadata, content, analytics, advertising configuration, and legal disclosures. Engineering infrastructure is shared only where it improves quality without making every site feel identical.

### Every site must

- deliver a useful result before monetization;
- serve one coherent audience or tool category;
- avoid thin, duplicate, or doorway content;
- use truthful metadata, formulas, examples, and structured data;
- be crawlable and understandable by search engines and AI systems;
- include privacy, accessibility, advertising, methodology, and legal disclosures that match actual behavior;
- remain independently deployable from the monorepo.

## GroundExact

GroundExact follows one practical journey:

```text
Measure → Calculate → Adjust → Buy
```

Its first calculator set covers mulch, gravel/stone, topsoil, sod, pavers, retaining walls, fencing, fertilizer, grass seed, and general cubic-volume calculations.

Tool state is explicit:

```text
planned → engine-ready → page-ready → live
```

A page becomes `live` only after its calculation, browser, SEO, repository, and publication gates pass. Inspect `apps/groundexact/src/tools/registry.ts` for current evidence; a file’s existence is not a release signal.

## Architecture

```text
apps/
  groundexact/          First public property
  _site-template/       Guidance for future independent-domain apps
packages/
  calculator-core/      Units, geometry, rounding, waste, and package math
  site-config/          Typed domain/site configuration
  analytics/            Provider-neutral event contract
  seo/                  Canonical and structured-data helpers
  monetization/         Ad, affiliate, and consent decisions
docs/                   Product, architecture, design, legal, and discovery guidance
```

A future site receives its own app and deployment project. Do not route one giant public application by hostname. Add shared UI or testing packages only after at least two real sites prove the abstraction is useful.

## Quick start

```bash
corepack enable
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev:groundexact
```

Avoid databases, authentication, accounts, queues, CMS infrastructure, or server APIs until a proven requirement needs them.

## Start here

Implementation agents should read, in order:

1. [`AGENTS.md`](AGENTS.md)
2. [`CODEX_HANDOFF.json`](CODEX_HANDOFF.json)
3. [`docs/architecture/monorepo.md`](docs/architecture/monorepo.md)
4. [`docs/architecture/multi-domain-deployment.md`](docs/architecture/multi-domain-deployment.md)
5. [`docs/product/groundexact-prd.md`](docs/product/groundexact-prd.md)
6. [`docs/design/groundexact-design-system.md`](docs/design/groundexact-design-system.md)
7. [`docs/seo/portfolio-seo-aeo.md`](docs/seo/portfolio-seo-aeo.md)
8. [`docs/seo/groundexact-page-map.md`](docs/seo/groundexact-page-map.md)

Do not claim the repository is green until the exact commit has completed the documented local gate.