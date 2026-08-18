import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scaffoldCompleteSite } from './complete-site-scaffold.mjs';

function makeRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'webtools-complete-site-'));
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
  return root;
}

test('complete scaffold adds structured data to static information pages', () => {
  const root = makeRoot();
  try {
    scaffoldCompleteSite(root, {
      key: 'restaurantmath',
      name: 'RestaurantMath',
      domain: 'https://restaurantmath.com',
      contactEmail: 'hello@restaurantmath.com',
    });
    const route = fs.readFileSync(path.join(root, 'apps', 'restaurantmath', 'src', 'pages', '[slug].astro'), 'utf8');
    assert.match(route, /buildToolWebPageSchema/);
    assert.match(route, /buildBreadcrumbSchema/);
    assert.match(route, /structuredData=\{structuredData\}/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
