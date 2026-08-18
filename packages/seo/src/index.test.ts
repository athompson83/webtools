import { describe, expect, it } from 'vitest';
import { buildBreadcrumbSchema, buildCanonicalUrl, buildRobotsTxt, buildSitemapXml, buildToolWebPageSchema } from './index';

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

  it('builds explicit search and OpenAI crawler policy with a configurable sitemap path', () => {
    const robots = buildRobotsTxt({
      origin: 'https://groundexact.com',
      allowSearchIndexing: true,
      allowOaiSearchBot: true,
      allowGptBot: false,
      sitemapPath: '/sitemap.xml',
    });
    expect(robots).toContain('User-agent: OAI-SearchBot\nAllow: /');
    expect(robots).toContain('User-agent: GPTBot\nDisallow: /');
    expect(robots).toContain('Sitemap: https://groundexact.com/sitemap.xml');
  });

  it('builds XML sitemap entries from canonical absolute URLs', () => {
    const sitemap = buildSitemapXml([
      'https://groundexact.com/',
      'https://groundexact.com/about',
    ]);
    expect(sitemap).toContain('<loc>https://groundexact.com/</loc>');
    expect(sitemap).toContain('<loc>https://groundexact.com/about</loc>');
  });
});
