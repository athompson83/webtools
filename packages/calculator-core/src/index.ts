export type LengthUnit = 'in' | 'ft' | 'yd' | 'cm' | 'm';
export type AreaUnit = 'sqft' | 'sqyd' | 'sqm';
export type VolumeUnit = 'cuft' | 'cuyd' | 'cum';

export interface WasteAdjustedQuantity {
  base: number;
  wastePercent: number;
  adjusted: number;
}

export function assertFiniteNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite, non-negative number.`);
  }
}

export function assertPercent(value: number, label = 'percent'): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} must be between 0 and 100.`);
  }
}

export function feetFrom(value: number, unit: LengthUnit): number {
  assertFiniteNonNegative(value, 'length');
  switch (unit) {
    case 'in': return value / 12;
    case 'ft': return value;
    case 'yd': return value * 3;
    case 'cm': return value / 30.48;
    case 'm': return value * 3.280839895;
  }
}

export function squareFeetFrom(value: number, unit: AreaUnit): number {
  assertFiniteNonNegative(value, 'area');
  switch (unit) {
    case 'sqft': return value;
    case 'sqyd': return value * 9;
    case 'sqm': return value * 10.763910417;
  }
}

export function cubicFeetToCubicYards(cubicFeet: number): number {
  assertFiniteNonNegative(cubicFeet, 'cubic feet');
  return cubicFeet / 27;
}

export function cubicYardsToCubicFeet(cubicYards: number): number {
  assertFiniteNonNegative(cubicYards, 'cubic yards');
  return cubicYards * 27;
}

export function rectangularAreaSqFt(length: number, width: number, unit: LengthUnit = 'ft'): number {
  return feetFrom(length, unit) * feetFrom(width, unit);
}

export function circularAreaSqFt(diameter: number, unit: LengthUnit = 'ft'): number {
  const radius = feetFrom(diameter, unit) / 2;
  return Math.PI * radius * radius;
}

export function volumeFromAreaAndDepthCuYd(areaSqFt: number, depthInches: number): number {
  assertFiniteNonNegative(areaSqFt, 'area');
  assertFiniteNonNegative(depthInches, 'depth');
  return cubicFeetToCubicYards(areaSqFt * (depthInches / 12));
}

export function applyWaste(base: number, wastePercent: number): WasteAdjustedQuantity {
  assertFiniteNonNegative(base, 'base quantity');
  assertPercent(wastePercent, 'waste percent');
  return { base, wastePercent, adjusted: base * (1 + wastePercent / 100) };
}

export function roundUpToIncrement(value: number, increment: number): number {
  assertFiniteNonNegative(value, 'value');
  if (!Number.isFinite(increment) || increment <= 0) {
    throw new RangeError('increment must be a finite number greater than zero.');
  }
  return Math.ceil((value - Number.EPSILON) / increment) * increment;
}

export function wholePackagesNeeded(totalCubicFeet: number, packageCubicFeet: number): number {
  assertFiniteNonNegative(totalCubicFeet, 'total cubic feet');
  if (!Number.isFinite(packageCubicFeet) || packageCubicFeet <= 0) {
    throw new RangeError('package cubic feet must be greater than zero.');
  }
  return Math.ceil(totalCubicFeet / packageCubicFeet);
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) throw new RangeError('value must be finite.');
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);
}
