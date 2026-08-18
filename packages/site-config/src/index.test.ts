import { describe, expect, it } from 'vitest';
import { absoluteUrl, validateSiteConfig, type SiteConfig } from './index';

const validConfig = (): SiteConfig => ({
  key: 'example',
  name: 'Example Tools',
  tagline: 'Useful tools.',
  description: 'A focused tool site.',
  productionOrigin: 'https://example.com',
  locale: 'en-US',
  brand: {
    background: '#ffffff',
    surface: '#ffffff',
    text: '#111111',
    mutedText: '#666666',
    accent: '#336644',
    accentStrong: '#224433',
    border: '#dddddd',
  },
  legal: {
    legalName: 'Example Tools LLC',
    contactEmail: 'hello@example.com',
    privacyEmail: 'privacy@example.com',
    jurisdiction: 'United States',
  },
  analytics: { provider: 'none' },
  ads: { enabled: false, provider: 'none' },
  allowSearchIndexing: false,
  allowOaiSearchBot: true,
  allowGptBot: false,
});

describe('site configuration', () => {
  it('accepts a canonical HTTPS production origin', () => {
    const config = validConfig();
    expect(validateSiteConfig(config)).toBe(config);
  });

  it('rejects production origins containing paths, queries, or insecure protocols', () => {
    expect(() => validateSiteConfig({ ...validConfig(), productionOrigin: 'https://example.com/path' as `https://${string}` })).toThrow(/canonical HTTPS origin/i);
    expect(() => validateSiteConfig({ ...validConfig(), productionOrigin: 'https://example.com?x=1' as `https://${string}` })).toThrow(/canonical HTTPS origin/i);
    expect(() => validateSiteConfig({ ...validConfig(), productionOrigin: 'http://example.com' as `https://${string}` })).toThrow(/canonical HTTPS origin/i);
  });

  it('requires site identity and legal contact information', () => {
    expect(() => validateSiteConfig({ ...validConfig(), key: '' })).toThrow(/site key and name/i);
    expect(() => validateSiteConfig({ ...validConfig(), legal: { ...validConfig().legal, contactEmail: 'invalid' } })).toThrow(/contact email/i);
  });

  it('builds absolute site URLs from relative paths', () => {
    expect(absoluteUrl(validConfig(), '/privacy')).toBe('https://example.com/privacy');
    expect(absoluteUrl(validConfig(), 'tools/example')).toBe('https://example.com/tools/example');
  });
});
