import { canActivateOptionalFeature, type ConsentState } from '@webtools/compliance';

export interface AdvertisingDecisionInput {
  adsEnabled: boolean;
  consent: ConsentState;
  consentRequired?: boolean;
}

export interface AdSlotDefinition {
  key: string;
  minWidth: number;
  minHeight: number;
  placement?: 'after-result' | 'between-sections' | 'sidebar' | 'footer';
}

export function canRenderAdvertising(input: AdvertisingDecisionInput): boolean {
  return canActivateOptionalFeature({
    enabled: input.adsEnabled,
    consentRequired: input.consentRequired ?? true,
    consent: input.consent,
  });
}

export function validateAdSlot<T extends AdSlotDefinition>(slot: T): T {
  if (!slot.key.trim()) throw new RangeError('ad slot key is required.');
  if (!Number.isFinite(slot.minWidth) || slot.minWidth <= 0) throw new RangeError('ad slot minWidth must be greater than zero.');
  if (!Number.isFinite(slot.minHeight) || slot.minHeight <= 0) throw new RangeError('ad slot minHeight must be greater than zero.');
  return slot;
}

export interface AffiliateLinkMetadata {
  merchant: string;
  campaign?: string;
  sponsored: true;
}

export function affiliateRel(): string {
  return 'sponsored nofollow noopener';
}
