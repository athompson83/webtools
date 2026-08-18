export interface SiteBrandTokens {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
  accentStrong: string;
  border: string;
}

export interface SiteLegalConfig {
  legalName: string;
  contactEmail: string;
  privacyEmail?: string;
  jurisdiction?: string;
}

export interface SiteAnalyticsConfig {
  provider: 'none' | 'google-analytics' | 'plausible';
  measurementId?: string;
}

export interface SiteAdsConfig {
  enabled: boolean;
  provider: 'none' | 'adsense' | 'other';
  clientId?: string;
}

export interface SiteConfig {
  key: string;
  name: string;
  tagline: string;
  description: string;
  productionOrigin: `https://${string}`;
  locale: string;
  brand: SiteBrandTokens;
  legal: SiteLegalConfig;
  analytics: SiteAnalyticsConfig;
  ads: SiteAdsConfig;
  allowSearchIndexing: boolean;
  allowOaiSearchBot: boolean;
  allowGptBot: boolean;
}

export function validateSiteConfig(config: SiteConfig): SiteConfig {
  const url = new URL(config.productionOrigin);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('productionOrigin must be a canonical HTTPS origin with no path, query, or hash.');
  }
  if (!config.name.trim() || !config.key.trim()) {
    throw new Error('site key and name are required.');
  }
  if (!config.legal.legalName.trim() || !config.legal.contactEmail.includes('@')) {
    throw new Error('valid legal name and contact email are required.');
  }
  return config;
}

export function absoluteUrl(config: SiteConfig, pathname = '/'): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalized, config.productionOrigin).toString();
}
