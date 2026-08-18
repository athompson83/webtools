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

export interface AdsTxtEntry {
  advertisingSystemDomain: string;
  publisherAccountId: string;
  relationship: 'DIRECT' | 'RESELLER';
  certificationAuthorityId?: string;
}

export interface AdvertisingReleaseInput {
  adsEnabled: boolean;
  provider: string;
  adsTxtRequired: boolean;
  adsTxtEntries: readonly AdsTxtEntry[];
}

function validateAdsTxtEntry(entry: AdsTxtEntry): AdsTxtEntry {
  const domain = entry.advertisingSystemDomain.trim().toLowerCase();
  if (!domain || domain.includes('://') || domain.includes('/') || domain.includes(' ')) {
    throw new RangeError('advertising system domain must be a bare domain such as google.com.');
  }
  if (!entry.publisherAccountId.trim() || entry.publisherAccountId.includes(',')) {
    throw new RangeError('publisher account ID is required and cannot contain commas.');
  }
  if (entry.certificationAuthorityId?.includes(',')) {
    throw new RangeError('certification authority ID cannot contain commas.');
  }
  return { ...entry, advertisingSystemDomain: domain, publisherAccountId: entry.publisherAccountId.trim(), certificationAuthorityId: entry.certificationAuthorityId?.trim() };
}

export function buildAdsTxt(entries: readonly AdsTxtEntry[]): string {
  return entries.map((entry) => {
    const valid = validateAdsTxtEntry(entry);
    const parts = [valid.advertisingSystemDomain, valid.publisherAccountId, valid.relationship];
    if (valid.certificationAuthorityId) parts.push(valid.certificationAuthorityId);
    return parts.join(', ');
  }).join('\n') + (entries.length > 0 ? '\n' : '');
}

export function assertAdvertisingReleaseReady(input: AdvertisingReleaseInput): void {
  if (!input.adsEnabled) return;
  if (!input.provider.trim() || input.provider === 'none') throw new Error('advertising is enabled but no advertising provider is configured.');
  if (input.adsTxtRequired && input.adsTxtEntries.length === 0) throw new Error('advertising release requires at least one ads.txt seller entry.');
  for (const entry of input.adsTxtEntries) validateAdsTxtEntry(entry);
}

export interface AffiliateLinkMetadata {
  merchant: string;
  campaign?: string;
  sponsored: true;
}

export function affiliateRel(): string {
  return 'sponsored nofollow noopener';
}
