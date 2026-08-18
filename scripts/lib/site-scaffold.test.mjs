import test from 'node:test';
import assert from 'node:assert/strict';
import { validateNewSiteRequest } from './site-scaffold.mjs';

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
