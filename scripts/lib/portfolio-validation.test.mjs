import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateManifestShape, validateRepositoryPortfolio } from './portfolio-validation.mjs';

const site = (overrides = {}) => ({
  key: 'groundexact',
  name: 'GroundExact',
  appDir: 'apps/groundexact',
  packageName: '@webtools/groundexact',
  productionOrigin: 'https://groundexact.com',
  status: 'mvp',
  ...overrides,
});

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

function makeRepositoryFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'webtools-portfolio-'));
  fs.mkdirSync(path.join(root, 'portfolio'), { recursive: true });
  fs.writeFileSync(path.join(root, 'portfolio', 'sites.json'), JSON.stringify({ sites: [site()] }));

  const appRoot = path.join(root, 'apps', 'groundexact');
  fs.mkdirSync(appRoot, { recursive: true });
  fs.writeFileSync(path.join(appRoot, 'package.json'), JSON.stringify({ name: '@webtools/groundexact' }));
  for (const relative of requiredSiteFiles) {
    const absolute = path.join(appRoot, relative);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    if (relative === 'site.config.ts') {
      fs.writeFileSync(absolute, "export const siteConfig = { key: 'groundexact', productionOrigin: 'https://groundexact.com' };\n");
    } else if (relative === 'astro.config.mjs') {
      fs.writeFileSync(absolute, "export default { site: 'https://groundexact.com' };\n");
    } else {
      fs.writeFileSync(absolute, '');
    }
  }
  return root;
}

test('accepts a valid portfolio manifest', () => {
  const manifest = { sites: [site()] };
  assert.equal(validateManifestShape(manifest), manifest);
});

test('rejects duplicate production origins', () => {
  assert.throws(() => validateManifestShape({
    sites: [
      site(),
      site({ key: 'other', name: 'Other', appDir: 'apps/other', packageName: '@webtools/other' }),
    ],
  }), /Duplicate production origin/);
});

test('rejects non-canonical or insecure origins', () => {
  assert.throws(() => validateManifestShape({ sites: [site({ productionOrigin: 'http://groundexact.com/path' })] }), /canonical HTTPS origin/);
});

test('requires deterministic app and package identity from the site key', () => {
  assert.throws(() => validateManifestShape({ sites: [site({ appDir: 'apps/../groundexact' })] }), /appDir must equal/i);
  assert.throws(() => validateManifestShape({ sites: [site({ packageName: '@webtools/not-groundexact' })] }), /packageName must equal/i);
});

test('rejects unsupported site lifecycle statuses', () => {
  assert.throws(() => validateManifestShape({ sites: [site({ status: 'mystery' })] }), /site status/i);
});

test('accepts a repository site that satisfies the release-critical file contract', () => {
  const root = makeRepositoryFixture();
  try {
    const manifest = validateRepositoryPortfolio(root);
    assert.equal(manifest.sites[0].key, 'groundexact');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('rejects a registered site missing a release-critical file', () => {
  const root = makeRepositoryFixture();
  try {
    fs.rmSync(path.join(root, 'apps', 'groundexact', 'src', 'pages', 'ads.txt.ts'));
    assert.throws(() => validateRepositoryPortfolio(root), /missing required site file.*ads\.txt/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('rejects Astro config whose site origin differs from the portfolio manifest', () => {
  const root = makeRepositoryFixture();
  try {
    fs.writeFileSync(path.join(root, 'apps', 'groundexact', 'astro.config.mjs'), "export default { site: 'https://wrong.example' };\n");
    assert.throws(() => validateRepositoryPortfolio(root), /Astro site origin mismatch/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
