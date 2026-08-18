import {
  applyWaste,
  cubicYardsToCubicFeet,
  roundUpToIncrement,
  volumeFromAreaAndDepthCuYd,
  wholePackagesNeeded,
} from '@webtools/calculator-core';

export interface MulchInput {
  areaSqFt: number;
  depthInches: number;
  wastePercent: number;
  orderIncrementCuYd?: number;
  bagSizeCuFt?: number;
}

export interface MulchResult {
  baseCuYd: number;
  adjustedCuYd: number;
  recommendedOrderCuYd: number;
  bagCount: number;
}

export function calculateMulch(input: MulchInput): MulchResult {
  const orderIncrement = input.orderIncrementCuYd ?? 0.25;
  const bagSize = input.bagSizeCuFt ?? 2;
  const baseCuYd = volumeFromAreaAndDepthCuYd(input.areaSqFt, input.depthInches);
  const { adjusted } = applyWaste(baseCuYd, input.wastePercent);

  return {
    baseCuYd,
    adjustedCuYd: adjusted,
    recommendedOrderCuYd: roundUpToIncrement(adjusted, orderIncrement),
    bagCount: wholePackagesNeeded(cubicYardsToCubicFeet(adjusted), bagSize),
  };
}
