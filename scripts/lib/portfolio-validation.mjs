import fs from 'node:fs';
import path from 'node:path';

const allowedStatuses = new Set(['scaffold', 'mvp', 'beta', 'production', 'retired']);
const requiredSiteFiles = [
  'astro.config.mjs',
  'site.config.ts',
  'src/pages/robots.txt.ts',
  'src/pages/sitemap.xml.ts',
  'src/pages/ads.txt.ts',
  'src/pages/404.astro',
  'src/content/static-pages.ts',
  'src/config/runtime-data.ts',
  'src/config/advertising.ts',
  'src/tools/registry.ts',
  'src/layouts/BaseLayout.astro',
  'src/layouts/ToolPageLayout.astro',
  'src/components/ToolActions.astro',
  'src/components/AdSlot.astro',
];

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function canonicalOrigin(value, label) {
  const origin = new URL(value);
  if (
    origin.protocol !== 'https:' ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password ||
    origin.port
  ) {
    throw new Error(`${label} must be a canonical HTTPS origin.`);
  }
  return origin.origin;
}

export function validateManifestShape(manifest) {
  if (!manifest || !Array.isArray(manifest.sites)) throw new Error('portfolio/sites.json must contain a sites array.');
  if (manifest.sites.length === 0) throw new Error('portfolio manifest must contain at least one site.');

  for (const [index, site] of manifest.sites.entries()) {
    const prefix = `sites[${index}]`;
    for (const field of ['key', 'name', 'appDir', 'packageName', 'productionOrigin', 'status']) {
      if (typeof site[field] !== 'string' || !site[field].trim()) throw new Error(`${prefix}.${field} is required.`);
    }
    if (!/^[a-z][a-z0-9-]*$/.test(site.key)) throw new Error(`${prefix}.key must use lowercase letters, numbers, and hyphens only.`);
    canonicalOrigin(site.productionOrigin, `${prefix}.productionOrigin`);
    if (site.appDir !== `apps/${site.key}`) throw new Error(`${prefix}.appDir must equal apps/${site.key}.`);
    if (site.packageName !== `@webtools/${site.key}`) throw new Error(`${prefix}.packageName must equal @webtools/${site.key}.`);
    if (!allowedStatuses.has(site.status)) throw new Error(`${prefix} site status is unsupported: ${site.status}.`);
  }

  assertUnique(manifest.sites.map((site) => site.key), 'site key');
  assertUnique(manifest.sites.map((site) => site.appDir), 'app directory');
  assertUnique(manifest.sites.map((site) => site.packageName), 'package name');
  assertUnique(manifest.sites.map((site) => site.productionOrigin), 'production origin');
  return manifest;
}

function extractSingleQuotedProperty(source, property) {
  const pattern = new RegExp(`${property}\\s*:\\s*'([^']+)'`);
  return source.match(pattern)?.[1] ?? null;
}

export function validateRepositoryPortfolio(rootDir) {
  const manifestPath = path.join(rootDir, 'portfolio', 'sites.json');
  const manifest = validateManifestShape(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
  const knownOrigins = manifest.sites.map((site) => site.productionOrigin);

  for (const site of manifest.sites) {
    const appDir = path.join(rootDir, site.appDir);
    if (!fs.existsSync(appDir)) throw new Error(`Missing app directory: ${site.appDir}`);

    const packagePath = path.join(appDir, 'package.json');
    const configPath = path.join(appDir, 'site.config.ts');
    if (!fs.existsSync(packagePath)) throw new Error(`Missing package.json for ${site.key}.`);
    if (!fs.existsSync(configPath)) throw new Error(`Missing site.config.ts for ${site.key}.`);

    for (const relativePath of requiredSiteFiles) {
      if (!fs.existsSync(path.join(appDir, relativePath))) {
        throw new Error(`${site.key} missing required site file: ${relativePath}`);
      }
    }

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (pkg.name !== site.packageName) throw new Error(`${site.key} package name mismatch: manifest=${site.packageName}, package.json=${pkg.name}`);

    const configSource = fs.readFileSync(configPath, 'utf8');
    const configKey = extractSingleQuotedProperty(configSource, 'key');
    const configOrigin = extractSingleQuotedProperty(configSource, 'productionOrigin');
    if (configKey !== site.key) throw new Error(`${site.key} site config key mismatch: ${configKey ?? 'missing'}`);
    if (configOrigin !== site.productionOrigin) throw new Error(`${site.key} production origin mismatch: ${configOrigin ?? 'missing'}`);

    const astroSource = fs.readFileSync(path.join(appDir, 'astro.config.mjs'), 'utf8');
    const astroOrigin = extractSingleQuotedProperty(astroSource, 'site');
    if (astroOrigin !== site.productionOrigin) {
      throw new Error(`${site.key} Astro site origin mismatch: manifest=${site.productionOrigin}, astro.config.mjs=${astroOrigin ?? 'missing'}`);
    }

    for (const otherOrigin of knownOrigins) {
      if (otherOrigin === site.productionOrigin) continue;
      if (configSource.includes(otherOrigin)) throw new Error(`${site.key} site.config.ts contains another site's production origin: ${otherOrigin}`);
      if (astroSource.includes(otherOrigin)) throw new Error(`${site.key} astro.config.mjs contains another site's production origin: ${otherOrigin}`);
    }
  }

  return manifest;
}
