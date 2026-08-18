# Multi-Domain Deployment Contract

## Decision

Each public brand is an independent app under `apps/<site-key>` and is deployed as an independent project with its own custom domain.

The repository is shared; the public runtime is not a hostname-switched monolith.

## Why

This architecture isolates:

- canonical origins
- sitemap output
- robots policy
- analytics properties
- advertising IDs and consent state
- legal entity/contact configuration
- branding
- environment variables
- deployment rollbacks
- performance regressions

A defect in one site should not require redeploying every other public property.

## Example mapping

| Workspace | Deployment project | Production domain |
|---|---|---|
| `apps/groundexact` | `webtools-groundexact` | `groundexact.com` |
| `apps/<future-restaurant-site>` | `webtools-<site-key>` | independent `.com` |
| `apps/<future-shipping-site>` | `webtools-<site-key>` | independent `.com` |

Actual future brands/domains must be decided before deployment; placeholders must never be published.

## Vercel pattern

When Vercel is used, create one Vercel project per app and set the project Root Directory to the applicable `apps/<site-key>` directory. The build still needs workspace dependencies from the monorepo, so deployment configuration must preserve access to the workspace root/package manager lockfile as required by the platform's current monorepo behavior.

Do not hard-code Vercel-specific APIs into app source code.

## Cloudflare pattern

If Cloudflare Pages/Workers is selected later, maintain one deploy target per app/domain and preserve the same app boundary. Platform migration must not require changing calculation modules.

## Environment variables

Prefix provider-specific secrets/configuration where practical and scope them to the deployment project that uses them.

Examples:

- analytics measurement IDs
- AdSense publisher/slot IDs
- consent-management identifiers
- IndexNow key/configuration if automation requires it
- monitoring DSN

Never commit secrets or live API keys.

## Domain authority

`site.config.ts` is the application-level authority for the production origin. A production deployment must fail review if its configured origin does not match the intended custom domain.

Canonical URLs, Open Graph URLs, structured data URLs, and sitemaps must derive from the same production origin.

## Cross-site links

Do not build a global reciprocal footer containing every property.

Permitted:

- a neutral parent-company/property attribution
- contextual links where the destination genuinely helps the user
- a legitimate portfolio page outside the sites if the business later creates one

Avoid keyword-rich cross-site anchor schemes.

## New-site checklist

1. Copy/scaffold from `apps/_site-template`.
2. Create unique site key and package name.
3. Set verified production origin.
4. Establish unique brand tokens and editorial voice.
5. Populate legal/contact configuration.
6. Configure robots policy explicitly.
7. Add only real, tested tools.
8. Add deployment project for that app.
9. Attach only that site's domain(s).
10. Verify canonical/sitemap/robots output against production domain.
11. Create separate search-console/webmaster/analytics property as applicable.
12. Verify no analytics/ad IDs from another site are present in built output.
