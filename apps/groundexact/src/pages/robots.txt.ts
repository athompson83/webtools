import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '@webtools/seo';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = buildRobotsTxt({
    origin: siteConfig.productionOrigin,
    allowSearchIndexing: siteConfig.allowSearchIndexing,
    allowOaiSearchBot: siteConfig.allowOaiSearchBot,
    allowGptBot: siteConfig.allowGptBot,
  });

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
