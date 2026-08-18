import { cubicFeetToCubicYards, rectangularAreaSqFt } from '@webtools/calculator-core';

export interface CubicYardInput {
  lengthFt: number;
  widthFt: number;
  depthInches: number;
}

export interface CubicYardResult {
  areaSqFt: number;
  cubicFeet: number;
  cubicYards: number;
}

export function calculateCubicYards(input: CubicYardInput): CubicYardResult {
  const areaSqFt = rectangularAreaSqFt(input.lengthFt, input.widthFt);
  if (!Number.isFinite(input.depthInches) || input.depthInches < 0) throw new RangeError('depth must be a finite, non-negative number.');
  const cubicFeet = areaSqFt * (input.depthInches / 12);
  return { areaSqFt, cubicFeet, cubicYards: cubicFeetToCubicYards(cubicFeet) };
}
