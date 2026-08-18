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

function isBasicEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.includes('@') && !trimmed.startsWith('@') && !trimmed.endsWith('@') && !/\s/.test(trimmed);
}

export function validateSiteConfig(config: SiteConfig): SiteConfig {
  const url = new URL(config.productionOrigin);
  if (
    url.protocol !== 'https:' ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    url.port
  ) {
    throw new Error('productionOrigin must be a canonical HTTPS origin with no credentials, port, path, query, or hash.');
  }

  if (!/^[a-z][a-z0-9-]*$/.test(config.key)) {
    throw new Error('site key must use lowercase letters, numbers, and hyphens only.');
  }
  if (!config.name.trim()) throw new Error('site name is required.');
  if (!config.tagline.trim()) throw new Error('site tagline is required.');
  if (!config.description.trim()) throw new Error('site description is required.');
  if (!config.locale.trim()) throw new Error('site locale is required.');

  if (!config.legal.legalName.trim()) throw new Error('valid legal name is required.');
  if (!isBasicEmail(config.legal.contactEmail)) throw new Error('valid contact email is required.');
  if (config.legal.privacyEmail !== undefined && !isBasicEmail(config.legal.privacyEmail)) {
    throw new Error('valid privacy email is required when provided.');
  }

  if (config.ads.enabled && config.ads.provider === 'none') {
    throw new Error('an advertising provider is required when advertising is enabled.');
  }

  if (config.analytics.provider === 'google-analytics' && !config.analytics.measurementId?.trim()) {
    throw new Error('Google Analytics measurement ID is required when Google Analytics is configured.');
  }

  return config;
}

export function absoluteUrl(config: SiteConfig, pathname = '/'): string {
  const raw = pathname.trim();
  if (raw.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    throw new RangeError('absolute URL path must remain on the configured origin.');
  }
  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  const base = new URL(config.productionOrigin);
  const url = new URL(normalized, base);
  if (url.origin !== base.origin) throw new RangeError('absolute URL path must remain on the configured origin.');
  return url.toString();
}
