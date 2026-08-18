import { describe, expect, it } from 'vitest';
import { calculateFence } from './calculate';

describe('calculateFence', () => {
  it('calculates panels, posts, rails, and pickets from project and product dimensions', () => {
    const result = calculateFence({
      runLengthFt: 80,
      panelWidthFt: 8,
      railsPerPanel: 2,
      picketsPerPanel: 16,
      gateCount: 1,
    });
    expect(result.panelsNeeded).toBe(10);
    expect(result.postsNeeded).toBe(12);
    expect(result.railsNeeded).toBe(20);
    expect(result.picketsNeeded).toBe(160);
  });
});
