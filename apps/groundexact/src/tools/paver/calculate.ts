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
  // Keep the percentage and square-inch conversion in one ratio. This avoids
  // a repeating-area intermediate without suppressing genuine fractions.
  const rawPaverCount = (
    input.areaSqFt * (100 + input.wastePercent) * 144
  ) / (100 * input.paverLengthInches * input.paverWidthInches);
  return {
    adjustedAreaSqFt,
    singlePaverAreaSqFt,
    paversNeeded: Math.ceil(rawPaverCount),
  };
}
