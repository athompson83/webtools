import { describe, expect, it } from 'vitest';
import { buildBreadcrumbSchema, buildCanonicalUrl, buildToolWebPageSchema } from './index';

describe('SEO helpers', () => {
  it('builds canonical URLs without preserving query strings', () => {
    expect(buildCanonicalUrl('https://groundexact.com', '/tools/mulch-calculator?l=20')).toBe('https://groundexact.com/tools/mulch-calculator');
  });

  it('builds breadcrumb structured data', () => {
    const schema = buildBreadcrumbSchema([
      { name: 'Home', url: 'https://groundexact.com/' },
      { name: 'Mulch Calculator', url: 'https://groundexact.com/tools/mulch-calculator' },
    ]);
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[1]?.position).toBe(2);
  });

  it('builds a WebPage schema for a calculator page', () => {
    const schema = buildToolWebPageSchema({
      name: 'Mulch Calculator',
      description: 'Calculate mulch.',
      url: 'https://groundexact.com/tools/mulch-calculator',
      dateModified: '2026-08-18',
    });
    expect(schema['@type']).toBe('WebPage');
    expect(schema.dateModified).toBe('2026-08-18');
  });
});
