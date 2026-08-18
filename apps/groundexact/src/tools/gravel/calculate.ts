import { applyWaste, rectangularAreaSqFt, roundUpToIncrement, volumeFromAreaAndDepthCuYd } from '@webtools/calculator-core';

export interface GravelInput {
  lengthFt: number;
  widthFt: number;
  depthInches: number;
  wastePercent: number;
  densityLbPerCuFt: number;
  bulkIncrementCuYd: number;
}

export interface GravelResult {
  areaSqFt: number;
  baseCuYd: number;
  adjustedCuYd: number;
  recommendedOrderCuYd: number;
  estimatedTons: number;
}

export function calculateGravel(input: GravelInput): GravelResult {
  const areaSqFt = rectangularAreaSqFt(input.lengthFt, input.widthFt);
  const baseCuYd = volumeFromAreaAndDepthCuYd(areaSqFt, input.depthInches);
  const { adjusted: adjustedCuYd } = applyWaste(baseCuYd, input.wastePercent);
  const recommendedOrderCuYd = roundUpToIncrement(adjustedCuYd, input.bulkIncrementCuYd);
  const adjustedCuFt = adjustedCuYd * 27;
  const estimatedTons = (adjustedCuFt * input.densityLbPerCuFt) / 2000;

  return { areaSqFt, baseCuYd, adjustedCuYd, recommendedOrderCuYd, estimatedTons };
}
