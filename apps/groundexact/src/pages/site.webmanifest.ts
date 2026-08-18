import type { APIRoute } from 'astro';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET: APIRoute = () => {
  const manifest = {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: siteConfig.brand.background,
    theme_color: siteConfig.brand.accentStrong,
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };

  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
