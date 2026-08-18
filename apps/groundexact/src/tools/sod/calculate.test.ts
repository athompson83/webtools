import { describe, expect, it } from 'vitest';
import { calculateSod } from './calculate';

describe('calculateSod', () => {
  it('calculates adjusted area, rolls, and pallets from supplier coverage values', () => {
    const result = calculateSod({ areaSqFt: 1000, wastePercent: 8, rollCoverageSqFt: 10, palletCoverageSqFt: 450 });
    expect(result.adjustedAreaSqFt).toBe(1080);
    expect(result.rollsNeeded).toBe(108);
    expect(result.palletsNeeded).toBe(3);
  });
});
