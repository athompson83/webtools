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
}

export function buildCanonicalUrl(origin: string, pathname: string): string {
  const url = new URL(pathname, origin);
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
    `Sitemap: ${origin.origin}/sitemap-index.xml`,
    '',
  ].join('\n');
}
