export interface FenceInput {
  runLengthFt: number;
  panelWidthFt: number;
  railsPerPanel: number;
  picketsPerPanel: number;
  gateWidthsFt: number[];
}

export interface FenceResult {
  netFenceLengthFt: number;
  panelsNeeded: number;
  postsNeeded: number;
  railsNeeded: number;
  picketsNeeded: number;
}

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) throw new RangeError(`${label} must be a non-negative integer.`);
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${label} must be greater than zero.`);
}

export function calculateFence(input: FenceInput): FenceResult {
  assertPositive(input.runLengthFt, 'run length');
  assertPositive(input.panelWidthFt, 'panel width');
  assertNonNegativeInteger(input.railsPerPanel, 'rails per panel');
  assertNonNegativeInteger(input.picketsPerPanel, 'pickets per panel');

  input.gateWidthsFt.forEach((width, index) => assertPositive(width, `gate ${index + 1} width`));
  const gateWidthFt = input.gateWidthsFt.reduce((sum, width) => sum + width, 0);
  const netFenceLengthFt = input.runLengthFt - gateWidthFt;
  if (netFenceLengthFt < 0) throw new RangeError('total gate width cannot exceed the straight run length.');

  const panelsNeeded = Math.ceil(netFenceLengthFt / input.panelWidthFt);
  const gatePostAllowance = input.gateWidthsFt.length;

  return {
    netFenceLengthFt,
    panelsNeeded,
    postsNeeded: panelsNeeded + 1 + gatePostAllowance,
    railsNeeded: panelsNeeded * input.railsPerPanel,
    picketsNeeded: panelsNeeded * input.picketsPerPanel,
  };
}
