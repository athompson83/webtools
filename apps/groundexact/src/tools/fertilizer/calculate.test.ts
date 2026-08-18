import { describe, expect, it } from 'vitest';
import { calculateFertilizer } from './calculate';

describe('calculateFertilizer', () => {
  it('uses the product label rate instead of a universal application rate', () => {
    const result = calculateFertilizer({ areaSqFt: 5000, labelRateLbPer1000SqFt: 4, bagWeightLb: 15 });
    expect(result.productNeededLb).toBe(20);
    expect(result.bagsNeeded).toBe(2);
    expect(result.coveragePerBagSqFt).toBe(3750);
  });
});
