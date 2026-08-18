import { describe, expect, it } from 'vitest';
import { calculateRetainingWall } from './calculate';

describe('calculateRetainingWall', () => {
  it('calculates courses, blocks per course, waste-adjusted block count, and caps', () => {
    const result = calculateRetainingWall({
      wallLengthFt: 24,
      wallHeightFt: 3,
      blockLengthInches: 12,
      blockHeightInches: 6,
      capLengthInches: 12,
      wastePercent: 5,
    });
    expect(result.courses).toBe(6);
    expect(result.blocksPerCourse).toBe(24);
    expect(result.baseBlockCount).toBe(144);
    expect(result.blocksToBuy).toBe(152);
    expect(result.capsToBuy).toBe(24);
  });
});
