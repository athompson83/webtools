export type ToolStateValue = string | number | boolean | null | undefined;

export interface NumberConstraints {
  min?: number;
  max?: number;
  integer?: boolean;
}

export function readNumber(value: unknown, label: string, constraints: NumberConstraints = {}): number {
  const parsed = typeof value === 'number' ? value : Number(String(value ?? '').trim());
  if (!Number.isFinite(parsed)) throw new RangeError(`${label} must be a finite number.`);
  if (constraints.integer && !Number.isInteger(parsed)) throw new RangeError(`${label} must be a whole number.`);
  if (constraints.min !== undefined && parsed < constraints.min) throw new RangeError(`${label} must be at least ${constraints.min}.`);
  if (constraints.max !== undefined && parsed > constraints.max) throw new RangeError(`${label} must be at most ${constraints.max}.`);
  return parsed;
}

export function parseNumberList(raw: unknown): number[] {
  const text = String(raw ?? '').trim();
  if (!text) return [];
  return text.split(',').map((part, index) => {
    const value = Number(part.trim());
    if (!Number.isFinite(value)) throw new RangeError(`List item ${index + 1} must be a finite number.`);
    return value;
  });
}

export function buildToolStatePath(pathname: string, state: Record<string, ToolStateValue>): string {
  const params = new URLSearchParams();
  for (const key of Object.keys(state).sort()) {
    const value = state[key];
    if (value === undefined || value === null || value === '') continue;
    params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function hydrateNamedFields(form: HTMLFormElement, params: URLSearchParams, fieldNames: readonly string[]): void {
  for (const name of fieldNames) {
    const value = params.get(name);
    if (value === null) continue;
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      field.value = value;
    }
  }
}

export function formState(form: HTMLFormElement, fieldNames: readonly string[]): Record<string, string> {
  const data = new FormData(form);
  const state: Record<string, string> = {};
  for (const name of fieldNames) {
    const value = data.get(name);
    if (value !== null) state[name] = String(value);
  }
  return state;
}

export function replaceToolState(pathname: string, state: Record<string, ToolStateValue>): void {
  history.replaceState(null, '', buildToolStatePath(pathname, state));
}
