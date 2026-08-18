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

function structuredStaticPageRoute() {
  return `---
import { buildBreadcrumbSchema, buildCanonicalUrl, buildToolWebPageSchema } from '@webtools/seo';
import { siteConfig } from '../../site.config';
import BaseLayout from '../layouts/BaseLayout.astro';
import { staticPages, type StaticPage } from '../content/static-pages';

export function getStaticPaths() {
  return staticPages.map((page) => ({ params: { slug: page.slug }, props: { page } }));
}

interface Props { page: StaticPage }
const { page } = Astro.props;
const pathname = '/' + page.slug;
const canonical = buildCanonicalUrl(siteConfig.productionOrigin, pathname);
const structuredData = [
  buildToolWebPageSchema({ name: page.title, description: page.description, url: canonical }),
  buildBreadcrumbSchema([
    { name: 'Home', url: buildCanonicalUrl(siteConfig.productionOrigin, '/') },
    { name: page.title, url: canonical },
  ]),
];
---
<BaseLayout title={page.title} description={page.description} pathname={pathname} structuredData={structuredData}>
  <article class="static-page container">
    <header><p class="eyebrow">{page.eyebrow ?? 'Information'}</p><h1>{page.title}</h1><p class="lead">{page.description}</p></header>
    {page.sections.map((section) => <section><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li>{bullet}</li>)}</ul>}</section>)}
  </article>
</BaseLayout>
`;
}

export function scaffoldCompleteSite(rootDir, input) {
  const request = scaffoldSite(rootDir, input);
  writeFile(rootDir, `${request.appDir}/src/config/advertising.ts`, advertisingConfig());
  writeFile(rootDir, `${request.appDir}/src/pages/ads.txt.ts`, adsTxtRoute());
  writeFile(rootDir, `${request.appDir}/src/pages/[slug].astro`, structuredStaticPageRoute());
  return request;
}
