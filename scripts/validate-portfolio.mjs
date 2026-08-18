import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateRepositoryPortfolio } from './lib/portfolio-validation.mjs';
import { validateSiteToolSources } from './lib/tool-source-validation.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, '..');

try {
  const manifest = validateRepositoryPortfolio(rootDir);
  console.log(`Portfolio validation passed for ${manifest.sites.length} site(s).`);
  for (const site of manifest.sites) {
    const tools = validateSiteToolSources(rootDir, site);
    console.log(`- ${site.key}: ${site.productionOrigin} -> ${site.appDir}; ${tools.tools} tools (${tools.pageReadyOrLive} page-ready/live)`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
