import { describe, expect, it } from 'vitest';
import { calculateMulch } from './calculate';

describe('calculateMulch', () => {
  it('calculates a 327 sq ft bed at 3 inches with 5% waste', () => {
    const result = calculateMulch({ areaSqFt: 327, depthInches: 3, wastePercent: 5 });

    expect(result.baseCuYd).toBeCloseTo(3.0278, 4);
    expect(result.adjustedCuYd).toBeCloseTo(3.1792, 4);
    expect(result.recommendedOrderCuYd).toBe(3.25);
    expect(result.bagCount).toBe(43);
  });

  it('rounds bulk orders upward to the configured increment', () => {
    const result = calculateMulch({
      areaSqFt: 100,
      depthInches: 2,
      wastePercent: 0,
      orderIncrementCuYd: 0.5,
    });

    expect(result.baseCuYd).toBeCloseTo(0.6173, 4);
    expect(result.recommendedOrderCuYd).toBe(1);
  });

  it('rejects negative quantities', () => {
    expect(() => calculateMulch({ areaSqFt: -1, depthInches: 3, wastePercent: 5 })).toThrow();
  });
});
