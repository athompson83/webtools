import { describe, expect, it } from 'vitest';
import { calculateCubicYards } from './calculate';

describe('calculateCubicYards', () => {
  it('converts rectangular project dimensions and depth into cubic feet and cubic yards', () => {
    const result = calculateCubicYards({ lengthFt: 18, widthFt: 12, depthInches: 4 });
    expect(result.areaSqFt).toBe(216);
    expect(result.cubicFeet).toBe(72);
    expect(result.cubicYards).toBeCloseTo(2.66667, 5);
  });
});
