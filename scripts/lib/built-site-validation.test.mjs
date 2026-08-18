import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateBuiltSite } from './built-site-validation.mjs';

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'webtools-dist-'));
  fs.mkdirSync(path.join(root, 'portfolio'), { recursive: true });
  fs.writeFileSync(path.join(root, 'portfolio', 'sites.json'), JSON.stringify({
    sites: [
      { key: 'groundexact', name: 'GroundExact', appDir: 'apps/groundexact', packageName: '@webtools/groundexact', productionOrigin: 'https://groundexact.com', status: 'mvp' },
      { key: 'other', name: 'Other', appDir: 'apps/other', packageName: '@webtools/other', productionOrigin: 'https://other.com', status: 'scaffold' },
    ],
  }));
  const dist = path.join(root, 'apps', 'groundexact', 'dist');
  fs.mkdirSync(path.join(dist, 'about'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'index.html'), '<link rel="canonical" href="https://groundexact.com/">');
  fs.writeFileSync(path.join(dist, 'about', 'index.html'), '<link rel="canonical" href="https://groundexact.com/about">');
  fs.writeFileSync(path.join(dist, 'robots.txt'), 'Sitemap: https://groundexact.com/sitemap.xml\n');
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), '<urlset><url><loc>https://groundexact.com/</loc></url></urlset>');
  return root;
}

test('accepts a build isolated to its declared production origin', () => {
  const root = makeFixture();
  try {
    const result = validateBuiltSite(root, 'groundexact');
    assert.equal(result.htmlFiles, 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('rejects another portfolio origin leaking into built HTML', () => {
  const root = makeFixture();
  try {
    fs.appendFileSync(path.join(root, 'apps', 'groundexact', 'dist', 'index.html'), '<a href="https://other.com">Other</a>');
    assert.throws(() => validateBuiltSite(root, 'groundexact'), /another portfolio origin/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('rejects a sitemap containing a foreign origin', () => {
  const root = makeFixture();
  try {
    fs.writeFileSync(path.join(root, 'apps', 'groundexact', 'dist', 'sitemap.xml'), '<urlset><url><loc>https://other.com/page</loc></url></urlset>');
    assert.throws(() => validateBuiltSite(root, 'groundexact'), /sitemap contains foreign origin/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
