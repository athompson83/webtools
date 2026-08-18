import { describe, expect, it } from 'vitest';
import { calculateSod } from './calculate';

describe('calculateSod', () => {
  it('calculates adjusted area, rolls, and pallets from supplier coverage values', () => {
    const result = calculateSod({ areaSqFt: 1000, wastePercent: 8, rollCoverageSqFt: 10, palletCoverageSqFt: 450 });
    expect(result.adjustedAreaSqFt).toBe(1080);
    expect(result.rollsNeeded).toBe(108);
    expect(result.palletsNeeded).toBe(3);
  });

  it('rejects non-positive supplier coverage values', () => {
    expect(() => calculateSod({ areaSqFt: 1000, wastePercent: 5, rollCoverageSqFt: 0, palletCoverageSqFt: 450 })).toThrow(/roll coverage/i);
    expect(() => calculateSod({ areaSqFt: 1000, wastePercent: 5, rollCoverageSqFt: 10, palletCoverageSqFt: -1 })).toThrow(/pallet coverage/i);
  });

  it('rejects waste percentages outside the supported range', () => {
    expect(() => calculateSod({ areaSqFt: 1000, wastePercent: 101, rollCoverageSqFt: 10, palletCoverageSqFt: 450 })).toThrow(/waste percent/i);
  });
});
