import { describe, expect, it } from 'vitest';
import { calculatePavers } from './calculate';

describe('calculatePavers', () => {
  it('calculates project area and whole paver count with waste', () => {
    const result = calculatePavers({ areaSqFt: 200, paverLengthInches: 8, paverWidthInches: 4, wastePercent: 10 });
    expect(result.adjustedAreaSqFt).toBeCloseTo(220, 10);
    expect(result.singlePaverAreaSqFt).toBeCloseTo(2 / 9, 10);
    expect(result.paversNeeded).toBe(990);
  });

  it('rounds a genuine fractional paver requirement up', () => {
    const result = calculatePavers({
      areaSqFt: 1.0000000000000002,
      paverLengthInches: 12,
      paverWidthInches: 12,
      wastePercent: 0,
    });
    expect(result.paversNeeded).toBe(2);
  });

  it('rejects non-positive paver dimensions', () => {
    expect(() => calculatePavers({ areaSqFt: 200, paverLengthInches: 0, paverWidthInches: 4, wastePercent: 10 })).toThrow(/paver length/i);
    expect(() => calculatePavers({ areaSqFt: 200, paverLengthInches: 8, paverWidthInches: -1, wastePercent: 10 })).toThrow(/paver width/i);
  });

  it('rejects waste percentages above 100 percent', () => {
    expect(() => calculatePavers({ areaSqFt: 200, paverLengthInches: 8, paverWidthInches: 4, wastePercent: 101 })).toThrow(/waste percent/i);
  });
});
