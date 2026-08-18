import { validateRuntimeDataInventory } from '@webtools/compliance';
import { siteConfig } from '../../site.config';

export const runtimeDataInventory = validateRuntimeDataInventory({
  serverStoresCalculatorInputs: false,
  acceptsFileUploads: false,
  analyticsProvider: siteConfig.analytics.provider,
  advertisingProvider: siteConfig.ads.provider,
  affiliateTracking: false,
  functionalStorage: [],
});

export const runtimeFeaturePolicy = {
  analyticsEnabled: siteConfig.analytics.provider !== 'none',
  advertisingEnabled: siteConfig.ads.enabled && siteConfig.ads.provider !== 'none',
  affiliateTrackingEnabled: runtimeDataInventory.affiliateTracking,
} as const;
