import { applyWaste } from '@webtools/calculator-core';

export interface RetainingWallInput {
  wallLengthFt: number;
  wallHeightFt: number;
  blockLengthInches: number;
  blockHeightInches: number;
  capLengthInches: number;
  wastePercent: number;
}

export interface RetainingWallResult {
  courses: number;
  blocksPerCourse: number;
  baseBlockCount: number;
  blocksToBuy: number;
  capsToBuy: number;
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${label} must be greater than zero.`);
}

export function calculateRetainingWall(input: RetainingWallInput): RetainingWallResult {
  assertPositive(input.wallLengthFt, 'wall length');
  assertPositive(input.wallHeightFt, 'wall height');
  assertPositive(input.blockLengthInches, 'block length');
  assertPositive(input.blockHeightInches, 'block height');
  assertPositive(input.capLengthInches, 'cap length');

  const wallLengthInches = input.wallLengthFt * 12;
  const wallHeightInches = input.wallHeightFt * 12;
  const courses = Math.ceil(wallHeightInches / input.blockHeightInches);
  const blocksPerCourse = Math.ceil(wallLengthInches / input.blockLengthInches);
  const baseBlockCount = courses * blocksPerCourse;
  const { adjusted } = applyWaste(baseBlockCount, input.wastePercent);

  return {
    courses,
    blocksPerCourse,
    baseBlockCount,
    blocksToBuy: Math.ceil(adjusted),
    capsToBuy: Math.ceil(wallLengthInches / input.capLengthInches),
  };
}
