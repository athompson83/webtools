# WebTools

A multi-site monorepo for a portfolio of focused utility websites. Each public property is an independently deployable app with its own domain, brand, SEO configuration, analytics/advertising configuration, and legal disclosures while sharing carefully bounded engineering infrastructure.

GroundExact is the first property.

## Start here if you are Codex or another implementation agent

Read in this order:

1. `AGENTS.md`
2. `CODEX_HANDOFF.json`
3. `docs/architecture/monorepo.md`
4. `docs/architecture/multi-domain-deployment.md`
5. `docs/product/groundexact-prd.md`
6. `docs/design/groundexact-design-system.md`
7. `docs/seo/portfolio-seo-aeo.md`
8. `docs/seo/groundexact-page-map.md`

Do not claim the repository is green until you have actually installed dependencies and run the full gate at the exact commit.

## Portfolio strategy

Each site must:

- Serve one coherent audience or tool category.
- Use its own brand, domain, visual identity, metadata, and content.
- Avoid thin or duplicate pages across properties.
- Provide a genuinely useful tool result before monetization.
- Be independently deployable from this monorepo.
- Share engineering infrastructure only where doing so does not make sites feel cloned.
- Include legal, privacy, accessibility, advertising, and methodology pages appropriate to its actual data behavior.
- Support SEO plus AI/LLM discovery through semantic HTML, transparent formulas, structured data where truthful, examples, crawlability, and accurate metadata.

## Current repository layout

```text
apps/
  groundexact/              # First site: outdoor project/material calculators
  _site-template/           # Instructions for future independent-domain apps

packages/
  calculator-core/          # Units, geometry, rounding, waste, packaging math
  site-config/              # Typed per-domain configuration
  analytics/                # Provider-neutral analytics event contract
  seo/                      # Canonical and structured-data helpers
  monetization/             # Provider-neutral ad/affiliate/consent decisions

docs/
  architecture/             # Monorepo and multi-domain contracts
  product/                  # GroundExact product requirements
  seo/                      # Portfolio and GroundExact search/discovery rules
  legal/                    # Data-inventory template
  design/                   # GroundExact visual/interaction rules

.github/
  workflows/ci.yml

CODEX_HANDOFF.json          # Machine-readable execution contract
AGENTS.md                    # Repository agent rules
```

Future packages such as shared Astro UI primitives, browser-testing utilities, or compliance helpers should be added only after two or more real sites prove the abstraction is useful. Do not create empty architecture merely to match an aspirational folder diagram.

## Domain model

Every application has its own `site.config.ts` containing or governing:

- production origin/domain
- site name and description
- brand tokens
- analytics configuration
- advertising configuration
- legal/contact information
- robots/indexing controls

Create one deployment project per app/domain. Do not route one giant public app by hostname.

See `docs/architecture/multi-domain-deployment.md`.

## GroundExact

GroundExact follows the user journey:

**Measure → Calculate → Adjust → Buy**

MVP calculators:

1. Mulch
2. Gravel / stone
3. Topsoil
4. Sod
5. Pavers
6. Retaining wall
7. Fence materials
8. Fertilizer coverage
9. Grass seed
10. Cubic yards / general material volume

### Tool lifecycle

GroundExact deliberately separates code completion from publication:

`planned → engine-ready → page-ready → live`

- `engine-ready`: deterministic calculation module exists.
- `page-ready`: engine and user-facing page exist, but release gates have not been certified.
- `live`: the page has passed calculation, repository, browser, SEO, and publication gates.

Inspect `apps/groundexact/src/tools/registry.ts` for current status. Never promote a status merely because a file exists.

## Current stack

- Astro
- TypeScript
- pnpm workspaces
- Vitest
- ESLint
- Prettier
- static-first deployment target

Browser E2E tooling such as Playwright should be added during release-hardening only if it is configured and used; it is not currently represented here as an installed dependency.

Avoid a database, authentication, user accounts, CMS, queues, or server APIs until a proven site requirement needs them.

## Development

Expected workflow:

```bash
corepack enable
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev:groundexact
```

If the repository does not yet contain a valid lockfile, create/repair it intentionally rather than pretending `--frozen-lockfile` passed.

## First Codex gate

Codex should make no feature changes until it has:

1. installed the workspace,
2. identified and repaired any baseline scaffolding defects,
3. run lint,
4. run typecheck,
5. run tests,
6. run the Astro build,
7. reported exact outcomes.

Only then continue the implementation order in `CODEX_HANDOFF.json`.
