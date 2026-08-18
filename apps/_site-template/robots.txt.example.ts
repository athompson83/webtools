import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '@webtools/seo';
import { siteConfig } from './site.config';

// Copy to apps/<site-key>/src/pages/robots.txt.ts and correct the siteConfig import path.
export const prerender = true;

export const GET: APIRoute = () => new Response(
  buildRobotsTxt({
    origin: siteConfig.productionOrigin,
    allowSearchIndexing: siteConfig.allowSearchIndexing,
    allowOaiSearchBot: siteConfig.allowOaiSearchBot,
    allowGptBot: siteConfig.allowGptBot,
  }),
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
