import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scaffoldSite } from './lib/site-scaffold.mjs';

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for --${key}`);
    values[key] = value;
    index += 1;
  }
  return values;
}

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, '..');

try {
  const args = parseArgs(process.argv.slice(2));
  const result = scaffoldSite(rootDir, {
    key: args.key,
    name: args.name,
    domain: args.domain,
    contactEmail: args['contact-email'],
  });

  console.log(`Created ${result.name} at ${result.appDir}`);
  console.log(`Domain: ${result.domain}`);
  console.log('Search indexing is disabled by default. Build real tools/content and pass publication gates before enabling it.');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error('Usage: pnpm create:site -- --key <site-key> --name "Site Name" --domain https://example.com --contact-email hello@example.com');
  process.exitCode = 1;
}
