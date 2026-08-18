# WebTools

A multi-site monorepo for a portfolio of focused utility websites. Each site is independently deployable on its own domain while sharing a common design system, calculator/runtime infrastructure, SEO/AEO utilities, analytics, ad placement conventions, legal/compliance components, and testing standards.

## Portfolio strategy

Each site must:

- Serve one coherent audience or tool category.
- Use its own brand, domain, visual identity, metadata, and content.
- Avoid thin or duplicate pages across properties.
- Provide a genuinely useful tool result before monetization.
- Be independently deployable from this monorepo.
- Share engineering infrastructure only where doing so does not make sites feel cloned.
- Include legal, privacy, accessibility, advertising, and methodology pages appropriate to its actual data behavior.
- Support SEO plus AI/LLM discovery through semantic HTML, structured data, sources, examples, crawlability, and accurate metadata.

## Monorepo layout

```text
apps/
  groundexact/              # First site: outdoor project/material calculators
  _site-template/           # Starter structure for future domains

packages/
  calculator-core/          # Units, rounding, waste factors, shared math
  site-config/              # Typed per-domain configuration
  seo/                      # Metadata, canonicals, schema, robots, sitemap helpers
  ui/                       # Shared low-level accessible UI primitives
  analytics/                # Analytics event contracts and provider adapters
  ads/                      # Ad-slot primitives and layout-shift safeguards
  compliance/               # Consent/legal/data-inventory helpers
  testing/                  # Shared fixtures and calculation assertions

content/
  portfolio/                # Portfolio-level governance and standards

docs/
  architecture/
  product/
  seo/
  legal/
  design/
  operations/

.github/
  workflows/
```

## Domain model

Every application has its own `site.config.ts` containing:

- production domain
- site name and description
- brand tokens
- analytics IDs
- ad configuration
- legal entity/contact information
- robots/indexing controls
- sitemap settings
- social metadata
- optional affiliate disclosures

Deployment platforms should create one project per app directory. This prevents routing one giant app by host header and keeps domains operationally isolated while preserving a single shared codebase.

## First site

`apps/groundexact` is the first property. GroundExact follows the user journey:

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
10. Universal material volume / cubic yards

## Recommended stack

- Astro
- TypeScript
- pnpm workspaces
- Vitest
- Playwright
- ESLint
- Prettier
- Static-first deployment to Vercel or Cloudflare

Avoid a database, authentication, user accounts, or server APIs until a site has a proven requirement for them.

## Development

```bash
pnpm install
pnpm dev:groundexact
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

See `AGENTS.md` for agent rules and `docs/architecture/monorepo.md` for the architectural contract.
