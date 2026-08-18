import type { APIRoute } from 'astro';
import { buildCanonicalUrl, buildSitemapXml } from '@webtools/seo';
import { toolPath } from '@webtools/tool-catalog';
import { siteConfig } from '../../site.config';
import { staticPages } from '../content/static-pages';
import { liveTools } from '../tools/registry';

export const prerender = true;

export const GET: APIRoute = () => {
  const paths = siteConfig.allowSearchIndexing
    ? [
        '/',
        ...staticPages.map((page) => `/${page.slug}`),
        ...liveTools.map((tool) => toolPath(tool.slug)),
      ]
    : [];
  const urls = paths.map((pathname) => buildCanonicalUrl(siteConfig.productionOrigin, pathname));
  const body = buildSitemapXml(urls);

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
