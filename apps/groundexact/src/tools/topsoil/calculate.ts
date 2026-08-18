import { applyWaste, rectangularAreaSqFt, roundUpToIncrement, volumeFromAreaAndDepthCuYd } from '@webtools/calculator-core';

export interface TopsoilInput {
  lengthFt: number;
  widthFt: number;
  depthInches: number;
  wastePercent: number;
  bulkIncrementCuYd: number;
}

export interface TopsoilResult {
  areaSqFt: number;
  baseCuYd: number;
  adjustedCuYd: number;
  recommendedOrderCuYd: number;
}

export function calculateTopsoil(input: TopsoilInput): TopsoilResult {
  const areaSqFt = rectangularAreaSqFt(input.lengthFt, input.widthFt);
  const baseCuYd = volumeFromAreaAndDepthCuYd(areaSqFt, input.depthInches);
  const { adjusted: adjustedCuYd } = applyWaste(baseCuYd, input.wastePercent);
  return {
    areaSqFt,
    baseCuYd,
    adjustedCuYd,
    recommendedOrderCuYd: roundUpToIncrement(adjustedCuYd, input.bulkIncrementCuYd),
  };
}
