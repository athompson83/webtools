import { describe, expect, it } from 'vitest';
import { calculatePavers } from './calculate';

describe('calculatePavers', () => {
  it('calculates project area and whole paver count with waste', () => {
    const result = calculatePavers({ areaSqFt: 200, paverLengthInches: 8, paverWidthInches: 4, wastePercent: 10 });
    expect(result.adjustedAreaSqFt).toBeCloseTo(220, 10);
    expect(result.singlePaverAreaSqFt).toBeCloseTo(2 / 9, 10);
    expect(result.paversNeeded).toBe(990);
  });
});
