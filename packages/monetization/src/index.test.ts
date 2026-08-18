import { describe, expect, it } from 'vitest';
import { canRenderAdvertising, validateAdSlot } from './index';

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
});
