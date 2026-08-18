import { describe, expect, it } from 'vitest';
import { calculateCubicYards } from './calculate';

describe('calculateCubicYards', () => {
  it('converts rectangular project dimensions and depth into cubic feet and cubic yards', () => {
    const result = calculateCubicYards({ lengthFt: 18, widthFt: 12, depthInches: 4 });
    expect(result.areaSqFt).toBe(216);
    expect(result.cubicFeet).toBe(72);
    expect(result.cubicYards).toBeCloseTo(2.66667, 5);
  });

  it('rejects negative depth', () => {
    expect(() => calculateCubicYards({ lengthFt: 18, widthFt: 12, depthInches: -1 })).toThrow(RangeError);
  });

  it('rejects negative dimensions through the shared area calculation', () => {
    expect(() => calculateCubicYards({ lengthFt: -1, widthFt: 12, depthInches: 4 })).toThrow(RangeError);
  });
});
