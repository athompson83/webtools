import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scaffoldSite, validateNewSiteRequest } from './site-scaffold.mjs';

test('accepts a valid new site request', () => {
  const request = validateNewSiteRequest({
    key: 'restaurantmath',
    name: 'RestaurantMath',
    domain: 'https://restaurantmath.com',
    contactEmail: 'hello@restaurantmath.com',
  });
  assert.equal(request.packageName, '@webtools/restaurantmath');
  assert.equal(request.appDir, 'apps/restaurantmath');
});

test('rejects unsafe site keys', () => {
  assert.throws(() => validateNewSiteRequest({
    key: '../other',
    name: 'Other',
    domain: 'https://other.com',
    contactEmail: 'hello@other.com',
  }), /lowercase letters/);
});

test('rejects domains with paths', () => {
  assert.throws(() => validateNewSiteRequest({
    key: 'other',
    name: 'Other',
    domain: 'https://other.com/tools',
    contactEmail: 'hello@other.com',
  }), /canonical HTTPS origin/);
});

test('requires a basic contact email', () => {
  assert.throws(() => validateNewSiteRequest({
    key: 'other',
    name: 'Other',
    domain: 'https://other.com',
    contactEmail: 'invalid',
  }), /contact email/);
});

test('scaffolds an isolated app with legal/runtime defaults and registers it in the portfolio manifest', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'webtools-site-'));
  try {
    fs.mkdirSync(path.join(root, 'portfolio'), { recursive: true });
    fs.writeFileSync(path.join(root, 'portfolio', 'sites.json'), JSON.stringify({
      sites: [{
        key: 'groundexact',
        name: 'GroundExact',
        appDir: 'apps/groundexact',
        packageName: '@webtools/groundexact',
        productionOrigin: 'https://groundexact.com',
        status: 'mvp',
      }],
    }));

    scaffoldSite(root, {
      key: 'restaurantmath',
      name: 'RestaurantMath',
      domain: 'https://restaurantmath.com',
      contactEmail: 'hello@restaurantmath.com',
    });

    const appRoot = path.join(root, 'apps', 'restaurantmath');
    for (const relative of [
      'src/pages/robots.txt.ts',
      'src/pages/sitemap.xml.ts',
      'src/pages/ads.txt.ts',
      'src/pages/404.astro',
      'src/pages/[slug].astro',
      'src/content/static-pages.ts',
      'src/config/runtime-data.ts',
      'src/config/advertising.ts',
      'src/tools/registry.ts',
      'src/layouts/ToolPageLayout.astro',
      'src/components/ToolActions.astro',
      'src/components/AdSlot.astro',
    ]) {
      assert.equal(fs.existsSync(path.join(appRoot, relative)), true, `${relative} should exist`);
    }

    const config = fs.readFileSync(path.join(appRoot, 'site.config.ts'), 'utf8');
    assert.match(config, /allowSearchIndexing: false/);
    assert.match(config, /https:\/\/restaurantmath\.com/);

    const advertising = fs.readFileSync(path.join(appRoot, 'src', 'config', 'advertising.ts'), 'utf8');
    assert.match(advertising, /adsTxtRequired = true/);
    assert.match(advertising, /adsTxtEntries: AdsTxtEntry\[\] = \[\]/);

    const baseLayout = fs.readFileSync(path.join(appRoot, 'src', 'layouts', 'BaseLayout.astro'), 'utf8');
    assert.match(baseLayout, /href="\/privacy"/);
    assert.match(baseLayout, /href="\/terms"/);
    assert.match(baseLayout, /href="\/cookies"/);
    assert.match(baseLayout, /href="\/advertising-disclosure"/);
    assert.match(baseLayout, /href="\/accessibility"/);

    const staticPages = fs.readFileSync(path.join(appRoot, 'src', 'content', 'static-pages.ts'), 'utf8');
    for (const slug of ['about', 'methodology', 'contact', 'privacy', 'terms', 'cookies', 'advertising-disclosure', 'accessibility']) {
      assert.match(staticPages, new RegExp(`slug: '${slug}'`));
    }

    const packageSource = fs.readFileSync(path.join(appRoot, 'package.json'), 'utf8');
    assert.match(packageSource, /@webtools\/compliance/);
    assert.match(packageSource, /@webtools\/monetization/);
    assert.match(packageSource, /@webtools\/tool-catalog/);

    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'portfolio', 'sites.json'), 'utf8'));
    assert.equal(manifest.sites.length, 2);
    assert.equal(manifest.sites[1].key, 'restaurantmath');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
