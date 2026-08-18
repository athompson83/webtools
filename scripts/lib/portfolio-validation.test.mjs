import test from 'node:test';
import assert from 'node:assert/strict';
import { validateManifestShape } from './portfolio-validation.mjs';

const site = (overrides = {}) => ({
  key: 'groundexact',
  name: 'GroundExact',
  appDir: 'apps/groundexact',
  packageName: '@webtools/groundexact',
  productionOrigin: 'https://groundexact.com',
  status: 'mvp',
  ...overrides,
});

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

test('requires each app directory to live under apps', () => {
  assert.throws(() => validateManifestShape({ sites: [site({ appDir: 'sites/groundexact' })] }), /must live under apps/);
});
