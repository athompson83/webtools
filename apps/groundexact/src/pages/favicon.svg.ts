import type { APIRoute } from 'astro';
import { siteConfig } from '../../site.config';

export const prerender = true;

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export const GET: APIRoute = () => {
  const initial = escapeXml(siteConfig.name.trim().charAt(0).toUpperCase() || 'G');
  const body = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeXml(siteConfig.name)}">
  <rect width="64" height="64" rx="14" fill="${siteConfig.brand.accentStrong}"/>
  <path d="M12 46h40M16 42V18M48 42V18M20 22h24" fill="none" stroke="${siteConfig.brand.background}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <text x="32" y="40" text-anchor="middle" font-family="Georgia,serif" font-size="28" font-weight="700" fill="${siteConfig.brand.background}">${initial}</text>
</svg>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
