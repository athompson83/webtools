import { describe, expect, it } from 'vitest';
import { assertAdvertisingReleaseReady, buildAdsTxt, canRenderAdvertising, validateAdSlot } from './index';

describe('monetization helpers', () => {
  it('does not render advertising unless site ads are enabled and consent allows the requested mode', () => {
    expect(canRenderAdvertising({ adsEnabled: false, consent: 'granted' })).toBe(false);
    expect(canRenderAdvertising({ adsEnabled: true, consent: 'denied' })).toBe(false);
    expect(canRenderAdvertising({ adsEnabled: true, consent: 'granted' })).toBe(true);
  });

  it('requires reserved positive dimensions for display slots', () => {
    expect(() => validateAdSlot({ key: 'tool-after-result', minWidth: 0, minHeight: 250 })).toThrow(RangeError);
    expect(validateAdSlot({ key: 'tool-after-result', minWidth: 300, minHeight: 250 }).key).toBe('tool-after-result');
  });

  it('builds standards-shaped ads.txt seller rows', () => {
    expect(buildAdsTxt([{
      advertisingSystemDomain: 'google.com',
      publisherAccountId: 'pub-1234567890',
      relationship: 'DIRECT',
      certificationAuthorityId: 'f08c47fec0942fa0',
    }])).toBe('google.com, pub-1234567890, DIRECT, f08c47fec0942fa0\n');
  });

  it('rejects malformed ads.txt seller domains', () => {
    expect(() => buildAdsTxt([{
      advertisingSystemDomain: 'https://google.com/path',
      publisherAccountId: 'pub-123',
      relationship: 'DIRECT',
    }])).toThrow(/advertising system domain/i);
  });

  it('fails advertising release when ads.txt is required but no seller rows are configured', () => {
    expect(() => assertAdvertisingReleaseReady({
      adsEnabled: true,
      provider: 'adsense',
      adsTxtRequired: true,
      adsTxtEntries: [],
    })).toThrow(/ads\.txt/i);
  });

  it('allows disabled advertising without seller configuration', () => {
    expect(() => assertAdvertisingReleaseReady({
      adsEnabled: false,
      provider: 'none',
      adsTxtRequired: true,
      adsTxtEntries: [],
    })).not.toThrow();
  });
});
