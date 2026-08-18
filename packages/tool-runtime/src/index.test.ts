import { describe, expect, it } from 'vitest';
import { buildToolStatePath, parseNumberList, readNumber } from './index';

describe('tool runtime', () => {
  it('builds a stable shareable path and omits empty values', () => {
    expect(buildToolStatePath('/tools/fence-calculator', {
      runLength: 80,
      gates: '4,10',
      note: '',
      optional: undefined,
    })).toBe('/tools/fence-calculator?gates=4%2C10&runLength=80');
  });

  it('parses comma-separated finite numbers', () => {
    expect(parseNumberList('4, 10.5')).toEqual([4, 10.5]);
    expect(parseNumberList('')).toEqual([]);
  });

  it('rejects malformed comma-separated numbers', () => {
    expect(() => parseNumberList('4, nope')).toThrow(/finite number/i);
  });

  it('reads constrained numeric input', () => {
    expect(readNumber('12.5', 'depth', { min: 0, max: 20 })).toBe(12.5);
    expect(() => readNumber('-1', 'depth', { min: 0 })).toThrow(/at least 0/i);
    expect(() => readNumber('2.5', 'count', { integer: true })).toThrow(/whole number/i);
  });
});
