export type ConsentState = 'unknown' | 'granted' | 'denied' | 'not-required';

export interface OptionalFeatureDecision {
  enabled: boolean;
  consentRequired: boolean;
  consent: ConsentState;
}

export interface RuntimeDataInventory {
  serverStoresCalculatorInputs: boolean;
  acceptsFileUploads: boolean;
  analyticsProvider: string;
  advertisingProvider: string;
  affiliateTracking: boolean;
  functionalStorage: string[];
}

export function canActivateOptionalFeature(input: OptionalFeatureDecision): boolean {
  if (!input.enabled) return false;
  if (!input.consentRequired) return true;
  return input.consent === 'granted' || input.consent === 'not-required';
}

export function validateRuntimeDataInventory<T extends RuntimeDataInventory>(inventory: T): T {
  if (!inventory.analyticsProvider.trim()) throw new RangeError('analytics provider is required; use "none" when disabled.');
  if (!inventory.advertisingProvider.trim()) throw new RangeError('advertising provider is required; use "none" when disabled.');

  for (const [index, label] of inventory.functionalStorage.entries()) {
    if (!label.trim()) throw new RangeError(`functional storage label ${index + 1} cannot be blank.`);
  }

  return inventory;
}

export function inventoryUsesOptionalTracking(inventory: RuntimeDataInventory): boolean {
  return inventory.analyticsProvider !== 'none' || inventory.advertisingProvider !== 'none' || inventory.affiliateTracking;
}
