# New Site Template

Copy this directory to `apps/<site-key>` when creating a new tool property.

## Required decisions before coding

1. Site name and confirmed production domain.
2. Audience and coherent tool category.
3. Initial 5–10 tool set.
4. Primary monetization path: ads, affiliate, lead generation, paid download, or a combination.
5. Site-specific visual identity.
6. Actual data collection and third-party providers.
7. SEO page map and content standards.
8. Legal/contact identity.

## Required files

```text
apps/<site>/
  package.json
  astro.config.mjs
  tsconfig.json
  site.config.ts
  public/robots.txt
  src/layouts/BaseLayout.astro
  src/pages/index.astro
  src/styles/global.css
  src/tools/registry.ts
```

## Domain isolation checklist

- `astro.config.mjs` has the site's exact canonical production origin.
- `site.config.ts` has the same origin.
- Analytics and ad IDs belong only to this property.
- Legal contact/data inventory is reviewed for this property.
- Sitemap contains only this site's URLs.
- Canonicals never reference another site.
- Cross-site links are contextually useful, not a global SEO link network.
- Design tokens and content voice are customized so the property does not look cloned.

## Tool implementation pattern

For each calculator create:

```text
src/tools/<tool>/
  calculate.ts
  calculate.test.ts
  definition.ts
```

Keep math pure and tested. UI pages import the result contract rather than duplicating formulas.
