import { describe, expect, it } from 'vitest';
import {
  applyWaste,
  circularAreaSqFt,
  cubicFeetToCubicYards,
  cubicYardsToCubicFeet,
  feetFrom,
  formatNumber,
  rectangularAreaSqFt,
  roundUpToIncrement,
  squareFeetFrom,
  volumeFromAreaAndDepthCuYd,
  wholePackagesNeeded,
} from './index';

describe('calculator core', () => {
  it('converts supported length units to feet', () => {
    expect(feetFrom(12, 'in')).toBe(1);
    expect(feetFrom(2, 'yd')).toBe(6);
    expect(feetFrom(30.48, 'cm')).toBeCloseTo(1, 10);
    expect(feetFrom(1, 'm')).toBeCloseTo(3.280839895, 9);
  });

  it('converts supported area units to square feet', () => {
    expect(squareFeetFrom(2, 'sqyd')).toBe(18);
    expect(squareFeetFrom(1, 'sqm')).toBeCloseTo(10.763910417, 9);
  });

  it('converts cubic feet and cubic yards bidirectionally', () => {
    expect(cubicFeetToCubicYards(27)).toBe(1);
    expect(cubicYardsToCubicFeet(2.5)).toBe(67.5);
  });

  it('calculates rectangular and circular areas', () => {
    expect(rectangularAreaSqFt(10, 12)).toBe(120);
    expect(circularAreaSqFt(10)).toBeCloseTo(Math.PI * 25, 10);
  });

  it('calculates volume from square feet and depth in inches', () => {
    expect(volumeFromAreaAndDepthCuYd(324, 3)).toBe(3);
  });

  it('applies a bounded waste percentage without rounding intermediate precision', () => {
    expect(applyWaste(10, 7.5)).toEqual({ base: 10, wastePercent: 7.5, adjusted: 10.75 });
  });

  it('rounds upward to supplier increments without over-rounding exact increments', () => {
    expect(roundUpToIncrement(3.18, 0.25)).toBe(3.25);
    expect(roundUpToIncrement(3.25, 0.25)).toBe(3.25);
  });

  it('calculates whole package quantities by rounding upward', () => {
    expect(wholePackagesNeeded(5, 2)).toBe(3);
    expect(wholePackagesNeeded(4, 2)).toBe(2);
  });

  it('formats numbers for presentation only', () => {
    expect(formatNumber(1234.567, 2)).toBe('1,234.57');
  });

  it('rejects negative, infinite, and invalid bounded values', () => {
    expect(() => feetFrom(-1, 'ft')).toThrow(/non-negative/i);
    expect(() => squareFeetFrom(Number.POSITIVE_INFINITY, 'sqft')).toThrow(/finite/i);
    expect(() => applyWaste(10, 101)).toThrow(/between 0 and 100/i);
    expect(() => roundUpToIncrement(5, 0)).toThrow(/greater than zero/i);
    expect(() => wholePackagesNeeded(5, 0)).toThrow(/greater than zero/i);
    expect(() => formatNumber(Number.NaN)).toThrow(/finite/i);
  });
});
