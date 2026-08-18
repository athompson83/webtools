import fs from 'node:fs';
import path from 'node:path';
import { scaffoldSite } from './site-scaffold.mjs';

function writeFile(rootDir, relativePath, content) {
  const absolutePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

function advertisingConfig() {
  return `import { assertAdvertisingReleaseReady, type AdsTxtEntry } from '@webtools/monetization';
import { siteConfig } from '../../site.config';

export const adsTxtRequired = true;
export const adsTxtEntries: AdsTxtEntry[] = [];

export function assertAdvertisingReady(): void {
  assertAdvertisingReleaseReady({
    adsEnabled: siteConfig.ads.enabled,
    provider: siteConfig.ads.provider,
    adsTxtRequired,
    adsTxtEntries,
  });
}

assertAdvertisingReady();
`;
}

function adsTxtRoute() {
  return `import type { APIRoute } from 'astro';
import { buildAdsTxt } from '@webtools/monetization';
import { adsTxtEntries, assertAdvertisingReady } from '../config/advertising';

export const prerender = true;

export const GET: APIRoute = () => {
  assertAdvertisingReady();
  return new Response(buildAdsTxt(adsTxtEntries), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
`;
}

export function scaffoldCompleteSite(rootDir, input) {
  const request = scaffoldSite(rootDir, input);
  writeFile(rootDir, `${request.appDir}/src/config/advertising.ts`, advertisingConfig());
  writeFile(rootDir, `${request.appDir}/src/pages/ads.txt.ts`, adsTxtRoute());
  return request;
}
