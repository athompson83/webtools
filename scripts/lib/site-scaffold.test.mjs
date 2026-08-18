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

test('scaffolds an isolated app and registers it in the portfolio manifest', () => {
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

    assert.equal(fs.existsSync(path.join(root, 'apps', 'restaurantmath', 'src', 'pages', 'robots.txt.ts')), true);
    assert.equal(fs.existsSync(path.join(root, 'apps', 'restaurantmath', 'src', 'pages', 'sitemap.xml.ts')), true);
    const config = fs.readFileSync(path.join(root, 'apps', 'restaurantmath', 'site.config.ts'), 'utf8');
    assert.match(config, /allowSearchIndexing: false/);
    assert.match(config, /https:\/\/restaurantmath\.com/);

    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'portfolio', 'sites.json'), 'utf8'));
    assert.equal(manifest.sites.length, 2);
    assert.equal(manifest.sites[1].key, 'restaurantmath');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
