import { assertAdvertisingReleaseReady, type AdsTxtEntry } from '@webtools/monetization';
import { siteConfig } from '../../site.config';

export const adsTxtRequired = true;
export const adsTxtEntries: AdsTxtEntry[] = [];

export function assertGroundExactAdvertisingReady(): void {
  assertAdvertisingReleaseReady({
    adsEnabled: siteConfig.ads.enabled,
    provider: siteConfig.ads.provider,
    adsTxtRequired,
    adsTxtEntries,
  });
}

assertGroundExactAdvertisingReady();
