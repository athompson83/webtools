import { describe, expect, it } from 'vitest';
import { canActivateOptionalFeature, validateRuntimeDataInventory } from './index';

describe('compliance runtime', () => {
  it('blocks a consent-gated feature while consent is unknown or denied', () => {
    expect(canActivateOptionalFeature({ enabled: true, consentRequired: true, consent: 'unknown' })).toBe(false);
    expect(canActivateOptionalFeature({ enabled: true, consentRequired: true, consent: 'denied' })).toBe(false);
  });

  it('allows enabled optional features when consent is granted or not required', () => {
    expect(canActivateOptionalFeature({ enabled: true, consentRequired: true, consent: 'granted' })).toBe(true);
    expect(canActivateOptionalFeature({ enabled: true, consentRequired: false, consent: 'unknown' })).toBe(true);
  });

  it('never activates a disabled feature', () => {
    expect(canActivateOptionalFeature({ enabled: false, consentRequired: false, consent: 'granted' })).toBe(false);
  });

  it('validates a concrete runtime data inventory', () => {
    const inventory = validateRuntimeDataInventory({
      serverStoresCalculatorInputs: false,
      acceptsFileUploads: false,
      analyticsProvider: 'none',
      advertisingProvider: 'none',
      affiliateTracking: false,
      functionalStorage: ['calculator-query-state'],
    });
    expect(inventory.analyticsProvider).toBe('none');
  });

  it('rejects blank provider names and storage labels', () => {
    expect(() => validateRuntimeDataInventory({
      serverStoresCalculatorInputs: false,
      acceptsFileUploads: false,
      analyticsProvider: ' ',
      advertisingProvider: 'none',
      affiliateTracking: false,
      functionalStorage: [],
    })).toThrow(/analytics provider/i);
  });
});
