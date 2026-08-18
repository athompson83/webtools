import { describe, expect, it } from 'vitest';
import { calculateGrassSeed } from './calculate';

describe('calculateGrassSeed', () => {
  it('uses the seed label rate and bag weight to determine purchase quantity', () => {
    const result = calculateGrassSeed({ areaSqFt: 7500, labelRateLbPer1000SqFt: 6, bagWeightLb: 20 });
    expect(result.seedNeededLb).toBe(45);
    expect(result.bagsNeeded).toBe(3);
    expect(result.coveragePerBagSqFt).toBeCloseTo(3333.3333, 4);
  });
});
