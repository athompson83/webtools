import { describe, expect, it } from 'vitest';
import { calculateGravel } from './calculate';

describe('calculateGravel', () => {
  it('calculates volume, waste-adjusted quantity, order quantity, and estimated tons', () => {
    const result = calculateGravel({
      lengthFt: 20,
      widthFt: 10,
      depthInches: 3,
      wastePercent: 5,
      densityLbPerCuFt: 100,
      bulkIncrementCuYd: 0.25,
    });

    expect(result.areaSqFt).toBe(200);
    expect(result.baseCuYd).toBeCloseTo(1.85185, 5);
    expect(result.adjustedCuYd).toBeCloseTo(1.94444, 5);
    expect(result.recommendedOrderCuYd).toBe(2);
    expect(result.estimatedTons).toBeCloseTo(2.625, 5);
  });
});
