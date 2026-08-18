import fs from 'node:fs';
import path from 'node:path';

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

export function validateManifestShape(manifest) {
  if (!manifest || !Array.isArray(manifest.sites)) throw new Error('portfolio/sites.json must contain a sites array.');
  if (manifest.sites.length === 0) throw new Error('portfolio manifest must contain at least one site.');

  for (const [index, site] of manifest.sites.entries()) {
    const prefix = `sites[${index}]`;
    for (const field of ['key', 'name', 'appDir', 'packageName', 'productionOrigin', 'status']) {
      if (typeof site[field] !== 'string' || !site[field].trim()) throw new Error(`${prefix}.${field} is required.`);
    }
    const origin = new URL(site.productionOrigin);
    if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) {
      throw new Error(`${prefix}.productionOrigin must be a canonical HTTPS origin.`);
    }
    if (!site.appDir.startsWith('apps/')) throw new Error(`${prefix}.appDir must live under apps/.`);
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

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (pkg.name !== site.packageName) throw new Error(`${site.key} package name mismatch: manifest=${site.packageName}, package.json=${pkg.name}`);

    const configSource = fs.readFileSync(configPath, 'utf8');
    const configKey = extractSingleQuotedProperty(configSource, 'key');
    const configOrigin = extractSingleQuotedProperty(configSource, 'productionOrigin');
    if (configKey !== site.key) throw new Error(`${site.key} site config key mismatch: ${configKey ?? 'missing'}`);
    if (configOrigin !== site.productionOrigin) throw new Error(`${site.key} production origin mismatch: ${configOrigin ?? 'missing'}`);

    for (const otherOrigin of knownOrigins) {
      if (otherOrigin === site.productionOrigin) continue;
      if (configSource.includes(otherOrigin)) throw new Error(`${site.key} site.config.ts contains another site's production origin: ${otherOrigin}`);
    }
  }

  return manifest;
}
