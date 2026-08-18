export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ToolWebPageSchemaInput {
  name: string;
  description: string;
  url: string;
  dateModified?: string;
}

export interface RobotsPolicyInput {
  origin: string;
  allowSearchIndexing: boolean;
  allowOaiSearchBot: boolean;
  allowGptBot: boolean;
  sitemapPath?: string;
}

function sameOriginUrl(origin: string, pathname: string, label: string): URL {
  const base = new URL(origin);
  const url = new URL(pathname, base);
  if (url.origin !== base.origin) throw new RangeError(`${label} must remain on the configured origin.`);
  return url;
}

export function buildCanonicalUrl(origin: string, pathname: string): string {
  const url = sameOriginUrl(origin, pathname, 'canonical URL');
  url.search = '';
  url.hash = '';
  return url.toString();
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } as const;
}

export function buildToolWebPageSchema(input: ToolWebPageSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  } as const;
}

export function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } as const;
}

export function buildRobotsTxt(input: RobotsPolicyInput): string {
  const origin = new URL(input.origin);
  const sitemapPath = input.sitemapPath ?? '/sitemap.xml';
  const sitemapUrl = sameOriginUrl(origin.origin, sitemapPath, 'sitemap URL').toString();
  const generalDirective = input.allowSearchIndexing ? 'Allow: /' : 'Disallow: /';
  const oaiDirective = input.allowOaiSearchBot ? 'Allow: /' : 'Disallow: /';
  const gptDirective = input.allowGptBot ? 'Allow: /' : 'Disallow: /';

  return [
    'User-agent: *',
    generalDirective,
    '',
    'User-agent: OAI-SearchBot',
    oaiDirective,
    '',
    'User-agent: GPTBot',
    gptDirective,
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function buildSitemapXml(urls: readonly string[]): string {
  const uniqueUrls = [...new Set(urls)];
  for (const url of uniqueUrls) {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') throw new RangeError('sitemap URLs must use HTTPS.');
    if (parsed.search || parsed.hash) throw new RangeError('sitemap URLs must be canonical and omit query strings and fragments.');
  }

  const entries = uniqueUrls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n');
}
