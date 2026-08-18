import { validateSiteConfig, type SiteConfig } from '@webtools/site-config';

// Copy this file to apps/<site-key>/site.config.ts and replace every example value.
// Do not deploy a site until the production origin and legal/contact configuration are real.
export const siteConfig: SiteConfig = validateSiteConfig({
  key: 'replace-site-key',
  name: 'Replace Site Name',
  tagline: 'Replace with a clear user-facing promise.',
  description: 'Replace with a concise description of the audience and tools.',
  productionOrigin: 'https://replace-domain.example.com',
  locale: 'en-US',
  brand: {
    background: '#f6f4ef',
    surface: '#ffffff',
    text: '#20231f',
    mutedText: '#666c65',
    accent: '#52645a',
    accentStrong: '#314039',
    border: '#d9ddd8',
  },
  legal: {
    legalName: 'Replace Legal/Business Name',
    contactEmail: 'hello@replace-domain.example.com',
    privacyEmail: 'privacy@replace-domain.example.com',
    jurisdiction: 'United States',
  },
  analytics: { provider: 'none' },
  ads: { enabled: false, provider: 'none' },
  allowSearchIndexing: false,
  allowOaiSearchBot: true,
  allowGptBot: false,
});
