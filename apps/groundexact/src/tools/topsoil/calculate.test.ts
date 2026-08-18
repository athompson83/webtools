import { describe, expect, it } from 'vitest';
import { calculateTopsoil } from './calculate';

describe('calculateTopsoil', () => {
  it('calculates area, volume, waste, and bulk order quantity', () => {
    const result = calculateTopsoil({ lengthFt: 30, widthFt: 12, depthInches: 2, wastePercent: 10, bulkIncrementCuYd: 0.25 });
    expect(result.areaSqFt).toBe(360);
    expect(result.baseCuYd).toBeCloseTo(2.22222, 5);
    expect(result.adjustedCuYd).toBeCloseTo(2.44444, 5);
    expect(result.recommendedOrderCuYd).toBe(2.5);
  });
});
