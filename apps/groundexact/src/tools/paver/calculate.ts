import { applyWaste, assertFiniteNonNegative } from '@webtools/calculator-core';

export interface PaverInput {
  areaSqFt: number;
  paverLengthInches: number;
  paverWidthInches: number;
  wastePercent: number;
}

export interface PaverResult {
  adjustedAreaSqFt: number;
  singlePaverAreaSqFt: number;
  paversNeeded: number;
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${label} must be greater than zero.`);
}

export function calculatePavers(input: PaverInput): PaverResult {
  assertFiniteNonNegative(input.areaSqFt, 'area');
  assertPositive(input.paverLengthInches, 'paver length');
  assertPositive(input.paverWidthInches, 'paver width');
  const { adjusted: adjustedAreaSqFt } = applyWaste(input.areaSqFt, input.wastePercent);
  const singlePaverAreaSqFt = (input.paverLengthInches * input.paverWidthInches) / 144;
  const rawPaverCount = adjustedAreaSqFt / singlePaverAreaSqFt;
  const roundingTolerance = Number.EPSILON * Math.max(1, Math.abs(rawPaverCount));
  return {
    adjustedAreaSqFt,
    singlePaverAreaSqFt,
    paversNeeded: Math.ceil(rawPaverCount - roundingTolerance),
  };
}
