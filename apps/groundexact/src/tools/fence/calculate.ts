export interface FenceInput {
  runLengthFt: number;
  panelWidthFt: number;
  railsPerPanel: number;
  picketsPerPanel: number;
  gateCount: number;
}

export interface FenceResult {
  panelsNeeded: number;
  postsNeeded: number;
  railsNeeded: number;
  picketsNeeded: number;
}

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) throw new RangeError(`${label} must be a non-negative integer.`);
}

export function calculateFence(input: FenceInput): FenceResult {
  if (!Number.isFinite(input.runLengthFt) || input.runLengthFt <= 0) throw new RangeError('run length must be greater than zero.');
  if (!Number.isFinite(input.panelWidthFt) || input.panelWidthFt <= 0) throw new RangeError('panel width must be greater than zero.');
  assertNonNegativeInteger(input.railsPerPanel, 'rails per panel');
  assertNonNegativeInteger(input.picketsPerPanel, 'pickets per panel');
  assertNonNegativeInteger(input.gateCount, 'gate count');

  const panelsNeeded = Math.ceil(input.runLengthFt / input.panelWidthFt);
  return {
    panelsNeeded,
    postsNeeded: panelsNeeded + 1 + input.gateCount,
    railsNeeded: panelsNeeded * input.railsPerPanel,
    picketsNeeded: panelsNeeded * input.picketsPerPanel,
  };
}
