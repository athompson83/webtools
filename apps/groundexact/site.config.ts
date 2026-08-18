import { validateSiteConfig, type SiteConfig } from '@webtools/site-config';

export const siteConfig: SiteConfig = validateSiteConfig({
  key: 'groundexact',
  name: 'GroundExact',
  tagline: 'Measure accurately. Buy the right amount.',
  description: 'Outdoor project calculators that turn measurements into practical material quantities, waste-adjusted order amounts, packaging equivalents, and shopping guidance.',
  productionOrigin: 'https://groundexact.com',
  locale: 'en-US',
  brand: {
    background: '#f5f1e8',
    surface: '#fffdf8',
    text: '#183126',
    mutedText: '#617067',
    accent: '#4e6c50',
    accentStrong: '#2f4a35',
    border: '#d9d2c5'
  },
  legal: {
    legalName: 'GroundExact',
    contactEmail: 'hello@groundexact.com',
    privacyEmail: 'privacy@groundexact.com',
    jurisdiction: 'United States'
  },
  analytics: {
    provider: 'none'
  },
  ads: {
    enabled: false,
    provider: 'none'
  },
  allowSearchIndexing: true,
  allowOaiSearchBot: true,
  allowGptBot: false
});
