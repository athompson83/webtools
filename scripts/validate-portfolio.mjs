import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateRepositoryPortfolio } from './lib/portfolio-validation.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, '..');

try {
  const manifest = validateRepositoryPortfolio(rootDir);
  console.log(`Portfolio validation passed for ${manifest.sites.length} site(s).`);
  for (const site of manifest.sites) console.log(`- ${site.key}: ${site.productionOrigin} -> ${site.appDir}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
