import fs from 'node:fs';
import path from 'node:path';
import { validateManifestShape } from './portfolio-validation.mjs';

export function validateNewSiteRequest(input) {
  const key = String(input.key ?? '').trim();
  const name = String(input.name ?? '').trim();
  const domain = String(input.domain ?? '').trim();
  const contactEmail = String(input.contactEmail ?? '').trim();

  if (!/^[a-z][a-z0-9-]*$/.test(key)) throw new Error('site key must use lowercase letters, numbers, and hyphens only.');
  if (!name) throw new Error('site name is required.');
  if (!contactEmail.includes('@')) throw new Error('a valid contact email is required.');

  const url = new URL(domain);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('domain must be a canonical HTTPS origin with no path, query, or hash.');
  }

  return {
    key,
    name,
    domain: url.origin,
    contactEmail,
    appDir: `apps/${key}`,
    packageName: `@webtools/${key}`,
  };
}

function writeFile(rootDir, relativePath, content) {
  const absolutePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

function packageJson(request) {
  return `${JSON.stringify({
    name: request.packageName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'astro dev',
      build: 'astro build',
      preview: 'astro preview',
      test: 'vitest run --passWithNoTests',
      typecheck: 'astro check',
      lint: 'eslint src site.config.ts --max-warnings=0',
    },
    dependencies: {
      '@webtools/seo': 'workspace:*',
      '@webtools/site-config': 'workspace:*',
      '@webtools/tool-runtime': 'workspace:*',
      astro: '^5.13.2',
    },
    devDependencies: {
      '@astrojs/check': '^0.9.4',
      typescript: '^5.9.2',
      vitest: '^3.2.4',
    },
  }, null, 2)}\n`;
}

function siteConfig(request) {
  return `import { validateSiteConfig, type SiteConfig } from '@webtools/site-config';

export const siteConfig: SiteConfig = validateSiteConfig({
  key: '${request.key}',
  name: '${request.name.replaceAll("'", "\\'")}',
  tagline: 'Useful tools. Clear answers.',
  description: '${request.name.replaceAll("'", "\\'")} provides focused web tools with transparent methodology and simple results.',
  productionOrigin: '${request.domain}',
  locale: 'en-US',
  brand: {
    background: '#f6f5f1',
    surface: '#ffffff',
    text: '#18201c',
    mutedText: '#68716c',
    accent: '#4b6756',
    accentStrong: '#2d4336',
    border: '#d8dcd9'
  },
  legal: {
    legalName: '${request.name.replaceAll("'", "\\'")}',
    contactEmail: '${request.contactEmail.replaceAll("'", "\\'")}',
    privacyEmail: '${request.contactEmail.replaceAll("'", "\\'")}',
    jurisdiction: 'United States'
  },
  analytics: { provider: 'none' },
  ads: { enabled: false, provider: 'none' },
  allowSearchIndexing: false,
  allowOaiSearchBot: true,
  allowGptBot: false
});
`;
}

function astroConfig(request) {
  return `import { defineConfig } from 'astro/config';

export default defineConfig({
  site: '${request.domain}',
  trailingSlash: 'never',
});
`;
}

function baseLayout(request) {
  return `---
import '../styles/global.css';
import { buildCanonicalUrl } from '@webtools/seo';
import { siteConfig } from '../../site.config';

interface Props {
  title: string;
  description: string;
  pathname?: string;
  noindex?: boolean;
}

const { title, description, pathname = '/', noindex = false } = Astro.props;
const canonical = buildCanonicalUrl(siteConfig.productionOrigin, pathname);
const fullTitle = title.includes(siteConfig.name) ? title : \`${'${title}'} | ${'${siteConfig.name}'}\`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta name="robots" content={noindex || !siteConfig.allowSearchIndexing ? 'noindex,follow' : 'index,follow,max-image-preview:large'} />
  </head>
  <body>
    <header class="site-header"><div class="container"><a class="brand" href="/">{siteConfig.name}</a></div></header>
    <main><slot /></main>
    <footer class="site-footer"><div class="container"><small>© {new Date().getFullYear()} {siteConfig.name}</small></div></footer>
  </body>
</html>
`;
}

function homePage() {
  return `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { siteConfig } from '../../site.config';
---
<BaseLayout title={siteConfig.name} description={siteConfig.description} pathname="/" noindex={!siteConfig.allowSearchIndexing}>
  <section class="hero container">
    <p class="eyebrow">Focused utility tools</p>
    <h1>{siteConfig.name}</h1>
    <p>{siteConfig.description}</p>
    <p><strong>Scaffold only.</strong> Do not enable search indexing until real tools and supporting content pass publication gates.</p>
  </section>
</BaseLayout>
`;
}

function robotsRoute() {
  return `import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '@webtools/seo';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET: APIRoute = () => new Response(buildRobotsTxt({
  origin: siteConfig.productionOrigin,
  allowSearchIndexing: siteConfig.allowSearchIndexing,
  allowOaiSearchBot: siteConfig.allowOaiSearchBot,
  allowGptBot: siteConfig.allowGptBot,
  sitemapPath: '/sitemap.xml',
}), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
`;
}

function sitemapRoute() {
  return `import type { APIRoute } from 'astro';
import { buildCanonicalUrl, buildSitemapXml } from '@webtools/seo';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET: APIRoute = () => {
  const urls = siteConfig.allowSearchIndexing ? [buildCanonicalUrl(siteConfig.productionOrigin, '/')] : [];
  return new Response(buildSitemapXml(urls), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
`;
}

function globalCss() {
  return `:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #18201c;
  background: #f6f5f1;
}
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
a { color: inherit; }
.container { width: min(1120px, calc(100% - 2rem)); margin-inline: auto; }
.site-header, .site-footer { padding: 1rem 0; border-block: 1px solid #d8dcd9; }
.brand { font-weight: 800; text-decoration: none; }
.hero { padding-block: clamp(4rem, 10vw, 8rem); max-width: 760px; }
.hero h1 { font-size: clamp(3rem, 9vw, 6rem); line-height: .95; letter-spacing: -.05em; margin: .4rem 0 1rem; }
.hero p { line-height: 1.7; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; font-weight: 800; }
`;
}

export function scaffoldSite(rootDir, rawInput) {
  const request = validateNewSiteRequest(rawInput);
  const manifestPath = path.join(rootDir, 'portfolio', 'sites.json');
  const manifest = validateManifestShape(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));

  if (manifest.sites.some((site) => site.key === request.key)) throw new Error(`site key already exists: ${request.key}`);
  if (manifest.sites.some((site) => site.productionOrigin === request.domain)) throw new Error(`production origin already exists: ${request.domain}`);
  if (fs.existsSync(path.join(rootDir, request.appDir))) throw new Error(`app directory already exists: ${request.appDir}`);

  writeFile(rootDir, `${request.appDir}/package.json`, packageJson(request));
  writeFile(rootDir, `${request.appDir}/tsconfig.json`, '{\n  "extends": "astro/tsconfigs/strict"\n}\n');
  writeFile(rootDir, `${request.appDir}/astro.config.mjs`, astroConfig(request));
  writeFile(rootDir, `${request.appDir}/site.config.ts`, siteConfig(request));
  writeFile(rootDir, `${request.appDir}/src/layouts/BaseLayout.astro`, baseLayout(request));
  writeFile(rootDir, `${request.appDir}/src/pages/index.astro`, homePage());
  writeFile(rootDir, `${request.appDir}/src/pages/robots.txt.ts`, robotsRoute());
  writeFile(rootDir, `${request.appDir}/src/pages/sitemap.xml.ts`, sitemapRoute());
  writeFile(rootDir, `${request.appDir}/src/styles/global.css`, globalCss());

  manifest.sites.push({
    key: request.key,
    name: request.name,
    appDir: request.appDir,
    packageName: request.packageName,
    productionOrigin: request.domain,
    status: 'scaffold',
  });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return request;
}
