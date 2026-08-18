import { applyWaste, assertFiniteNonNegative } from '@webtools/calculator-core';

export interface SodInput {
  areaSqFt: number;
  wastePercent: number;
  rollCoverageSqFt: number;
  palletCoverageSqFt: number;
}

export interface SodResult {
  adjustedAreaSqFt: number;
  rollsNeeded: number;
  palletsNeeded: number;
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${label} must be greater than zero.`);
}

export function calculateSod(input: SodInput): SodResult {
  assertFiniteNonNegative(input.areaSqFt, 'area');
  assertPositive(input.rollCoverageSqFt, 'roll coverage');
  assertPositive(input.palletCoverageSqFt, 'pallet coverage');
  const { adjusted: adjustedAreaSqFt } = applyWaste(input.areaSqFt, input.wastePercent);
  return {
    adjustedAreaSqFt,
    rollsNeeded: Math.ceil(adjustedAreaSqFt / input.rollCoverageSqFt),
    palletsNeeded: Math.ceil(adjustedAreaSqFt / input.palletCoverageSqFt),
  };
}
