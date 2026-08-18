export interface FertilizerInput {
  areaSqFt: number;
  labelRateLbPer1000SqFt: number;
  bagWeightLb: number;
}

export interface FertilizerResult {
  productNeededLb: number;
  bagsNeeded: number;
  coveragePerBagSqFt: number;
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${label} must be greater than zero.`);
}

export function calculateFertilizer(input: FertilizerInput): FertilizerResult {
  assertPositive(input.areaSqFt, 'area');
  assertPositive(input.labelRateLbPer1000SqFt, 'label rate');
  assertPositive(input.bagWeightLb, 'bag weight');

  const productNeededLb = (input.areaSqFt / 1000) * input.labelRateLbPer1000SqFt;
  return {
    productNeededLb,
    bagsNeeded: Math.ceil(productNeededLb / input.bagWeightLb),
    coveragePerBagSqFt: (input.bagWeightLb / input.labelRateLbPer1000SqFt) * 1000,
  };
}
