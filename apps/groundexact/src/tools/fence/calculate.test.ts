import { describe, expect, it } from 'vitest';
import { calculateFence } from './calculate';

describe('calculateFence', () => {
  it('subtracts gate width before calculating panels and adds gate post allowance', () => {
    const result = calculateFence({
      runLengthFt: 80,
      panelWidthFt: 8,
      railsPerPanel: 2,
      picketsPerPanel: 16,
      gateWidthsFt: [8],
    });
    expect(result.netFenceLengthFt).toBe(72);
    expect(result.panelsNeeded).toBe(9);
    expect(result.postsNeeded).toBe(11);
    expect(result.railsNeeded).toBe(18);
    expect(result.picketsNeeded).toBe(144);
  });

  it('rejects gates wider than the total straight run', () => {
    expect(() => calculateFence({
      runLengthFt: 10,
      panelWidthFt: 8,
      railsPerPanel: 2,
      picketsPerPanel: 16,
      gateWidthsFt: [12],
    })).toThrow(RangeError);
  });
});
