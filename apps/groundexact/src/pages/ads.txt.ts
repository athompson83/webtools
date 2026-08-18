import type { APIRoute } from 'astro';
import { buildAdsTxt } from '@webtools/monetization';
import { adsTxtEntries, assertGroundExactAdvertisingReady } from '../config/advertising';

export const prerender = true;

export const GET: APIRoute = () => {
  assertGroundExactAdvertisingReady();
  return new Response(buildAdsTxt(adsTxtEntries), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
