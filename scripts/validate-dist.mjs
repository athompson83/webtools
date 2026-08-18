import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateManifestShape } from './lib/portfolio-validation.mjs';
import { validateBuiltSite } from './lib/built-site-validation.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = validateManifestShape(JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio', 'sites.json'), 'utf8')));

let failed = false;
for (const site of manifest.sites) {
  try {
    const result = validateBuiltSite(rootDir, site.key);
    console.log(`Validated ${result.siteKey}: ${result.htmlFiles} HTML files at ${result.productionOrigin}`);
  } catch (error) {
    failed = true;
    console.error(error instanceof Error ? error.message : error);
  }
}

if (failed) process.exitCode = 1;
