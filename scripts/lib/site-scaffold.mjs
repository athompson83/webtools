import fs from 'node:fs';
import path from 'node:path';
import { validateManifestShape } from './portfolio-validation.mjs';

export function validateNewSiteRequest(input) {
  const key = String(input.key ?? '').trim();
  const name = String(input.name ?? '').trim();
  const domain = String(input.domain ?? '').trim();
  const contactEmail = String(input.contactEmail ?? '').trim();

  if (!/^[a-z][a-z0-9-]*$/.test(key)) throw new Error('site key must use lowercase letters, numbers, and hyphens only.');
  if (!name) throw new Error('site name is required.');
  if (!contactEmail.includes('@')) throw new Error('a valid contact email is required.');

  const url = new URL(domain);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('domain must be a canonical HTTPS origin with no path, query, or hash.');
  }

  return {
    key,
    name,
    domain: url.origin,
    contactEmail,
    appDir: `apps/${key}`,
    packageName: `@webtools/${key}`,
  };
}

function escaped(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

function writeFile(rootDir, relativePath, content) {
  const absolutePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

function packageJson(request) {
  return `${JSON.stringify({
    name: request.packageName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'astro dev',
      build: 'astro build',
      preview: 'astro preview',
      test: 'vitest run --passWithNoTests',
      typecheck: 'astro check',
      lint: 'eslint src site.config.ts --max-warnings=0',
    },
    dependencies: {
      '@webtools/analytics': 'workspace:*',
      '@webtools/compliance': 'workspace:*',
      '@webtools/monetization': 'workspace:*',
      '@webtools/seo': 'workspace:*',
      '@webtools/site-config': 'workspace:*',
      '@webtools/tool-catalog': 'workspace:*',
      '@webtools/tool-runtime': 'workspace:*',
      astro: '^5.13.2',
    },
    devDependencies: {
      '@astrojs/check': '^0.9.4',
      typescript: '^5.9.2',
      vitest: '^3.2.4',
    },
  }, null, 2)}\n`;
}

function siteConfig(request) {
  return `import { validateSiteConfig, type SiteConfig } from '@webtools/site-config';

export const siteConfig: SiteConfig = validateSiteConfig({
  key: '${escaped(request.key)}',
  name: '${escaped(request.name)}',
  tagline: 'Useful tools. Clear answers.',
  description: '${escaped(request.name)} provides focused web tools with transparent methodology and simple results.',
  productionOrigin: '${escaped(request.domain)}',
  locale: 'en-US',
  brand: {
    background: '#f6f5f1',
    surface: '#ffffff',
    text: '#18201c',
    mutedText: '#68716c',
    accent: '#4b6756',
    accentStrong: '#2d4336',
    border: '#d8dcd9'
  },
  legal: {
    legalName: '${escaped(request.name)}',
    contactEmail: '${escaped(request.contactEmail)}',
    privacyEmail: '${escaped(request.contactEmail)}',
    jurisdiction: 'United States'
  },
  analytics: { provider: 'none' },
  ads: { enabled: false, provider: 'none' },
  allowSearchIndexing: false,
  allowOaiSearchBot: true,
  allowGptBot: false
});
`;
}

function astroConfig(request) {
  return `import { defineConfig } from 'astro/config';

export default defineConfig({
  site: '${escaped(request.domain)}',
  trailingSlash: 'never',
});
`;
}

function baseLayout() {
  return `---
import '../styles/global.css';
import { buildCanonicalUrl } from '@webtools/seo';
import { siteConfig } from '../../site.config';

interface Props {
  title: string;
  description: string;
  pathname?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown>[];
}

const { title, description, pathname = '/', noindex = false, structuredData = [] } = Astro.props;
const canonical = buildCanonicalUrl(siteConfig.productionOrigin, pathname);
const fullTitle = title.includes(siteConfig.name) ? title : title + ' | ' + siteConfig.name;
const schemas = [
  { '@context': 'https://schema.org', '@type': 'Organization', name: siteConfig.name, url: siteConfig.productionOrigin },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: siteConfig.name, url: siteConfig.productionOrigin, description: siteConfig.description, inLanguage: siteConfig.locale },
  ...structuredData,
];
const theme = [
  '--background:' + siteConfig.brand.background,
  '--surface:' + siteConfig.brand.surface,
  '--text:' + siteConfig.brand.text,
  '--muted-text:' + siteConfig.brand.mutedText,
  '--accent:' + siteConfig.brand.accent,
  '--accent-strong:' + siteConfig.brand.accentStrong,
  '--border:' + siteConfig.brand.border,
].join(';');
---
<!doctype html>
<html lang="en" style={theme}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta name="robots" content={noindex || !siteConfig.allowSearchIndexing ? 'noindex,follow' : 'index,follow,max-image-preview:large'} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteConfig.name} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary_large_image" />
    {schemas.map((schema) => <script type="application/ld+json" set:html={JSON.stringify(schema)} />)}
  </head>
  <body>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="/">{siteConfig.name}</a>
        <nav aria-label="Primary navigation">
          <a href="/#tools">Tools</a>
          <a href="/methodology">Methodology</a>
          <a href="/about">About</a>
        </nav>
      </div>
    </header>
    <main><slot /></main>
    <footer class="site-footer">
      <div class="container footer-grid">
        <div><strong>{siteConfig.name}</strong><p>{siteConfig.description}</p></div>
        <div class="footer-links">
          <strong>Information</strong>
          <a href="/about">About</a>
          <a href="/methodology">Methodology</a>
          <a href="/contact">Contact</a>
          <a href="/accessibility">Accessibility</a>
        </div>
        <div class="footer-links">
          <strong>Legal</strong>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/cookies">Cookie policy</a>
          <a href="/advertising-disclosure">Advertising & affiliate disclosure</a>
        </div>
      </div>
    </footer>
  </body>
</html>
`;
}

function toolPageLayout() {
  return `---
import { buildBreadcrumbSchema, buildCanonicalUrl, buildToolWebPageSchema } from '@webtools/seo';
import { relatedLiveTools, toolPath } from '@webtools/tool-catalog';
import { siteConfig } from '../../site.config';
import AdSlot from '../components/AdSlot.astro';
import ToolActions from '../components/ToolActions.astro';
import BaseLayout from './BaseLayout.astro';
import { tools } from '../tools/registry';

interface Props {
  title: string;
  description: string;
  pathname: string;
  intro: string;
  reviewedDate: string;
  methodologySummary: string;
}

const { title, description, pathname, intro, reviewedDate, methodologySummary } = Astro.props;
const slug = pathname.split('/').filter(Boolean).at(-1);
const tool = tools.find((entry) => entry.slug === slug);
const canonical = buildCanonicalUrl(siteConfig.productionOrigin, pathname);
const noindex = tool?.status !== 'live';
const related = slug ? relatedLiveTools(tools, slug).map((entry) => ({ href: toolPath(entry.slug), name: entry.name })) : [];
const structuredData = [
  buildToolWebPageSchema({ name: title, description, url: canonical }),
  buildBreadcrumbSchema([
    { name: 'Home', url: buildCanonicalUrl(siteConfig.productionOrigin, '/') },
    { name: title, url: canonical },
  ]),
];
---
<BaseLayout title={title} description={description} pathname={pathname} noindex={noindex} structuredData={structuredData}>
  <article class="tool-page container">
    <header class="tool-heading">
      <p class="eyebrow">Utility tool</p>
      <h1>{title}</h1>
      <p class="lead">{intro}</p>
      <p class="reviewed">Reviewed {reviewedDate}</p>
    </header>
    <section class="tool-workspace" aria-label={title + ' workspace'}>
      <div class="input-panel"><slot name="tool" /></div>
      <aside class="result-panel" aria-live="polite"><slot name="results" /></aside>
    </section>
    <ToolActions />
    <AdSlot slotKey="tool-after-result" placement="after-result" />
    <section class="methodology">
      <div><p class="eyebrow">Methodology</p><h2>Understand the output.</h2></div>
      <div class="prose"><p>{methodologySummary}</p><slot name="methodology" /></div>
    </section>
    <slot name="example" />
    <slot name="faq" />
    {related.length > 0 && <section class="related"><h2>Related tools</h2><div class="related-grid">{related.map((entry) => <a href={entry.href}>{entry.name} →</a>)}</div></section>}
  </article>
</BaseLayout>
`;
}

function toolActions() {
  return `<div class="tool-actions" data-tool-actions>
  <button type="button" data-copy-link>Copy link</button>
  <button type="button" data-print>Print</button>
  <span data-status aria-live="polite"></span>
</div>
<script>
  const root = document.querySelector('[data-tool-actions]');
  if (root instanceof HTMLElement) {
    const status = root.querySelector('[data-status]');
    const message = (value: string) => { if (status instanceof HTMLElement) status.textContent = value; };
    root.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(window.location.href); message('Link copied.'); }
      catch { message('Copy failed. Use the browser address bar.'); }
    });
    root.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  }
</script>
<style>
  .tool-actions { display:flex; gap:.65rem; align-items:center; flex-wrap:wrap; margin-top:1rem; }
  .tool-actions button { border:1px solid var(--border); background:transparent; padding:.65rem .8rem; font:inherit; font-weight:700; cursor:pointer; }
  .tool-actions span { color:var(--muted-text); font-size:.82rem; }
  @media print { .tool-actions { display:none; } }
</style>
`;
}

function adSlot() {
  return `---
import { validateAdSlot } from '@webtools/monetization';
import { siteConfig } from '../../site.config';
interface Props { slotKey: string; minWidth?: number; minHeight?: number; placement?: 'after-result' | 'between-sections' | 'sidebar' | 'footer' }
const { slotKey, minWidth = 300, minHeight = 250, placement = 'between-sections' } = Astro.props;
const slot = validateAdSlot({ key: slotKey, minWidth, minHeight, placement });
const enabled = siteConfig.ads.enabled && siteConfig.ads.provider !== 'none';
---
{enabled && <aside class="ad-shell" aria-label="Advertisement" data-ad-slot={slot.key} style={'--ad-height:' + slot.minHeight + 'px'}><span>Advertisement</span><div class="ad-space"></div></aside>}
<style>
  .ad-shell { margin-block:2rem; text-align:center; }
  .ad-shell > span { color:var(--muted-text); font-size:.68rem; text-transform:uppercase; letter-spacing:.1em; }
  .ad-space { min-height:var(--ad-height); }
  @media print { .ad-shell { display:none; } }
</style>
`;
}

function homePage() {
  return `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { siteConfig } from '../../site.config';
import { tools } from '../tools/registry';
---
<BaseLayout title={siteConfig.name} description={siteConfig.description} pathname="/" noindex={!siteConfig.allowSearchIndexing}>
  <section class="hero container">
    <p class="eyebrow">Focused utility tools</p>
    <h1>{siteConfig.name}</h1>
    <p>{siteConfig.description}</p>
    <p class="scaffold-note"><strong>Scaffold mode:</strong> search indexing remains disabled until real tools and supporting content pass publication gates.</p>
  </section>
  <section id="tools" class="container section">
    <p class="eyebrow">Tool library</p>
    <h2>Tools will appear here after they are deliberately defined.</h2>
    {tools.length === 0 ? <p>No public tools have been registered yet.</p> : <div class="tool-grid">{tools.map((tool) => <article><h3>{tool.name}</h3><p>{tool.description}</p><small>{tool.status}</small></article>)}</div>}
  </section>
</BaseLayout>
`;
}

function staticPages() {
  return `import { siteConfig } from '../../site.config';

export interface StaticSection { heading: string; paragraphs?: string[]; bullets?: string[] }
export interface StaticPage { slug: string; title: string; description: string; eyebrow?: string; sections: StaticSection[] }

const contactEmail = siteConfig.legal.contactEmail;
const privacyEmail = siteConfig.legal.privacyEmail ?? contactEmail;
const analyticsSummary = siteConfig.analytics.provider === 'none'
  ? 'Optional analytics is currently disabled in site configuration.'
  : 'Analytics is configured through ' + siteConfig.analytics.provider + '. Review this policy and the provider terms before production release.';
const advertisingSummary = !siteConfig.ads.enabled || siteConfig.ads.provider === 'none'
  ? 'Display advertising is currently disabled in site configuration.'
  : 'Advertising is configured through ' + siteConfig.ads.provider + '. Confirm consent and disclosure requirements before production release.';

export const staticPages: StaticPage[] = [
  { slug: 'about', title: 'About ' + siteConfig.name, description: 'Learn about ' + siteConfig.name + ' and its approach to useful web tools.', eyebrow: 'About', sections: [
    { heading: 'Useful tools with visible assumptions', paragraphs: [siteConfig.name + ' is designed to make focused tasks faster and easier. Tool pages should explain their inputs, output, assumptions, limitations, and methodology rather than hiding important behavior.'] },
    { heading: 'Contact', paragraphs: ['Questions, corrections, or business inquiries can be sent to ' + contactEmail + '.'] },
  ] },
  { slug: 'methodology', title: 'Methodology', description: 'How ' + siteConfig.name + ' builds, reviews, and explains its tools.', eyebrow: 'Methodology', sections: [
    { heading: 'Transparent outputs', paragraphs: ['Every production tool should explain what it calculates or generates, which assumptions affect the result, and which values come from the user, a product, a supplier, or an external source.'] },
    { heading: 'Publication gates', paragraphs: ['A tool should not be treated as certified public content until its behavior, metadata, accessibility, mobile experience, and supporting explanation have been verified.'] },
  ] },
  { slug: 'contact', title: 'Contact ' + siteConfig.name, description: 'Contact ' + siteConfig.name + ' about corrections, privacy, accessibility, advertising, or general questions.', eyebrow: 'Contact', sections: [
    { heading: 'General questions', paragraphs: ['Email ' + contactEmail + ' for general questions, corrections, accessibility feedback, advertising, or partnerships.'] },
    { heading: 'Privacy', paragraphs: ['Privacy-related questions can be sent to ' + privacyEmail + '.'] },
  ] },
  { slug: 'privacy', title: 'Privacy Policy', description: siteConfig.name + ' privacy policy.', eyebrow: 'Legal', sections: [
    { heading: 'Overview', paragraphs: [siteConfig.name + ' is intended to operate core tools without requiring an account unless a future product requirement explicitly changes that behavior. This policy must remain synchronized with the runtime data inventory and live providers.'] },
    { heading: 'Information you provide', paragraphs: ['If you contact us, we may receive your email address and the information included in your message. Do not put sensitive personal information into ordinary tool inputs unless a tool explicitly requires and protects it.'] },
    { heading: 'Tool inputs', paragraphs: ['The scaffold assumes ordinary tool inputs are processed in the browser and are not stored on the server. If a future tool uploads or stores data, update the runtime inventory and this policy before release.'] },
    { heading: 'Analytics', paragraphs: [analyticsSummary] },
    { heading: 'Advertising', paragraphs: [advertisingSummary] },
    { heading: 'Your questions and choices', paragraphs: ['Contact ' + privacyEmail + ' with privacy questions or requests that may apply to you. Available rights vary by location and data practice.'] },
  ] },
  { slug: 'terms', title: 'Terms of Use', description: 'Terms governing use of ' + siteConfig.name + ' tools and content.', eyebrow: 'Legal', sections: [
    { heading: 'Informational tools', paragraphs: [siteConfig.name + ' provides utility tools and informational content. Outputs depend on the inputs and assumptions provided and should be independently checked when a decision is consequential.'] },
    { heading: 'No professional guarantee', paragraphs: ['Unless a page explicitly states otherwise under an appropriate professional service, tool outputs are not engineering, legal, medical, financial, tax, architectural, or other licensed professional advice.'] },
    { heading: 'Third parties', paragraphs: ['External links, advertisers, affiliates, vendors, or data providers may have their own terms and policies. Verify third-party information before relying on it.'] },
    { heading: 'Production legal review', paragraphs: ['These implementation terms must be reviewed for the actual operating legal entity, governing law, liability language, and business model before monetized production release.'] },
  ] },
  { slug: 'cookies', title: 'Cookie Policy', description: 'Cookie and browser-storage policy for ' + siteConfig.name + '.', eyebrow: 'Legal', sections: [
    { heading: 'Browser technologies', paragraphs: ['Cookies, local storage, and similar browser technologies may be used for required preferences, consent choices, analytics, advertising, or tool state when those features are implemented.'] },
    { heading: 'Current configuration', paragraphs: [analyticsSummary, advertisingSummary] },
    { heading: 'Consent', paragraphs: ['Where consent is required for an optional feature, that feature should remain inactive until the applicable consent signal permits it.'] },
  ] },
  { slug: 'advertising-disclosure', title: 'Advertising & Affiliate Disclosure', description: 'Advertising and affiliate disclosure for ' + siteConfig.name + '.', eyebrow: 'Disclosure', sections: [
    { heading: 'How the site may earn money', paragraphs: ['The site may eventually earn revenue from display advertising, affiliate links, sponsorships, or other clearly disclosed commercial relationships. ' + advertisingSummary] },
    { heading: 'Tool independence', paragraphs: ['Commercial compensation should not silently change a deterministic tool formula or cause an advertisement to masquerade as a tool control, result, or download action.'] },
  ] },
  { slug: 'accessibility', title: 'Accessibility', description: siteConfig.name + ' accessibility commitment.', eyebrow: 'Accessibility', sections: [
    { heading: 'Our approach', paragraphs: ['Production tools should support keyboard operation, visible focus, semantic labels, sufficient contrast, readable error messages, and results that do not depend on color alone.'] },
    { heading: 'Report a barrier', paragraphs: ['Email ' + contactEmail + ' with the page, device/browser if known, and a description of the accessibility barrier.'] },
  ] },
];

export function getStaticPage(slug: string): StaticPage | undefined { return staticPages.find((page) => page.slug === slug); }
`;
}

function staticPageRoute() {
  return `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { staticPages, type StaticPage } from '../content/static-pages';

export function getStaticPaths() {
  return staticPages.map((page) => ({ params: { slug: page.slug }, props: { page } }));
}

interface Props { page: StaticPage }
const { page } = Astro.props;
---
<BaseLayout title={page.title} description={page.description} pathname={'/' + page.slug}>
  <article class="static-page container">
    <header><p class="eyebrow">{page.eyebrow ?? 'Information'}</p><h1>{page.title}</h1><p class="lead">{page.description}</p></header>
    {page.sections.map((section) => <section><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li>{bullet}</li>)}</ul>}</section>)}
  </article>
</BaseLayout>
`;
}

function notFoundPage() {
  return `---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Not Found" description="The requested page could not be found." pathname="/404" noindex={true}>
  <section class="static-page container"><p class="eyebrow">404 · Page not found</p><h1>This page is not here.</h1><p>Return to the homepage or browse the available tools.</p><p><a class="button-link" href="/">Return home</a></p></section>
</BaseLayout>
`;
}

function toolRegistry() {
  return `import { liveTools as selectLiveTools, validateToolDefinitions, type ToolDefinition } from '@webtools/tool-catalog';

export type ToolSummary = ToolDefinition<string>;
export const tools: ToolSummary[] = validateToolDefinitions([]);
export const liveTools = selectLiveTools(tools);
`;
}

function runtimeData() {
  return `import { validateRuntimeDataInventory } from '@webtools/compliance';
import { siteConfig } from '../../site.config';

export const runtimeDataInventory = validateRuntimeDataInventory({
  serverStoresCalculatorInputs: false,
  acceptsFileUploads: false,
  analyticsProvider: siteConfig.analytics.provider,
  advertisingProvider: siteConfig.ads.provider,
  affiliateTracking: false,
  functionalStorage: [],
});
`;
}

function robotsRoute() {
  return `import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '@webtools/seo';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET: APIRoute = () => new Response(buildRobotsTxt({
  origin: siteConfig.productionOrigin,
  allowSearchIndexing: siteConfig.allowSearchIndexing,
  allowOaiSearchBot: siteConfig.allowOaiSearchBot,
  allowGptBot: siteConfig.allowGptBot,
  sitemapPath: '/sitemap.xml',
}), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
`;
}

function sitemapRoute() {
  return `import type { APIRoute } from 'astro';
import { buildCanonicalUrl, buildSitemapXml } from '@webtools/seo';
import { toolPath } from '@webtools/tool-catalog';
import { siteConfig } from '../../site.config';
import { staticPages } from '../content/static-pages';
import { liveTools } from '../tools/registry';

export const prerender = true;

export const GET: APIRoute = () => {
  const paths = siteConfig.allowSearchIndexing
    ? ['/', ...staticPages.map((page) => '/' + page.slug), ...liveTools.map((tool) => toolPath(tool.slug))]
    : [];
  const urls = paths.map((pathname) => buildCanonicalUrl(siteConfig.productionOrigin, pathname));
  return new Response(buildSitemapXml(urls), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
`;
}

function globalCss() {
  return `:root { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color:var(--text); background:var(--background); }
* { box-sizing:border-box; }
body { margin:0; min-width:320px; background:var(--background); color:var(--text); }
a { color:inherit; }
.container { width:min(1120px, calc(100% - 2rem)); margin-inline:auto; }
.site-header, .site-footer { border-color:var(--border); border-style:solid; border-width:0; }
.site-header { border-bottom-width:1px; background:var(--surface); }
.header-inner { min-height:68px; display:flex; align-items:center; justify-content:space-between; gap:1rem; }
.header-inner nav { display:flex; gap:1rem; flex-wrap:wrap; }
.header-inner nav a, .brand { text-decoration:none; font-weight:750; }
.site-footer { border-top-width:1px; margin-top:5rem; padding-block:2.5rem; background:var(--surface); }
.footer-grid { display:grid; grid-template-columns:2fr 1fr 1.2fr; gap:2rem; }
.footer-grid p { color:var(--muted-text); max-width:55ch; line-height:1.6; }
.footer-links { display:grid; align-content:start; gap:.55rem; }
.footer-links a { color:var(--muted-text); text-decoration:none; }
.hero { padding-block:clamp(4rem, 10vw, 8rem); max-width:820px; }
.hero h1, .static-page h1, .tool-heading h1 { font-size:clamp(3rem, 9vw, 6rem); line-height:.95; letter-spacing:-.05em; margin:.4rem 0 1rem; }
.hero p, .static-page p, .static-page li, .prose { line-height:1.7; }
.lead, .scaffold-note { color:var(--muted-text); }
.eyebrow { text-transform:uppercase; letter-spacing:.12em; font-size:.75rem; font-weight:800; color:var(--accent-strong); }
.section { padding-block:3rem; }
.tool-grid, .related-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; }
.tool-grid article, .related-grid a { border:1px solid var(--border); background:var(--surface); padding:1.1rem; }
.static-page { max-width:840px; padding-block:clamp(3rem, 8vw, 6rem); }
.static-page section { padding-block:1.5rem; border-top:1px solid var(--border); }
.static-page h2 { font-size:clamp(1.6rem, 4vw, 2.4rem); }
.tool-page { padding-block:clamp(3rem, 7vw, 6rem); }
.tool-heading { max-width:780px; }
.reviewed { color:var(--muted-text); font-size:.88rem; }
.tool-workspace { display:grid; grid-template-columns:minmax(0, 1.05fr) minmax(300px, .95fr); margin-top:2rem; border:1px solid var(--border); background:var(--surface); }
.input-panel, .result-panel { padding:clamp(1.25rem, 3vw, 2rem); }
.result-panel { border-left:1px solid var(--border); background:color-mix(in srgb, var(--accent) 7%, var(--surface)); }
.methodology { display:grid; grid-template-columns:.8fr 1.2fr; gap:clamp(2rem, 7vw, 7rem); padding-block:4rem; border-bottom:1px solid var(--border); }
.button-link { display:inline-block; padding:.75rem 1rem; background:var(--accent-strong); color:white; text-decoration:none; font-weight:750; }
button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline:3px solid color-mix(in srgb, var(--accent) 65%, white); outline-offset:2px; }
@media (max-width:800px) { .footer-grid, .tool-workspace, .methodology { grid-template-columns:1fr; } .result-panel { border-left:0; border-top:1px solid var(--border); } .tool-grid, .related-grid { grid-template-columns:1fr; } }
`;
}

export function scaffoldSite(rootDir, rawInput) {
  const request = validateNewSiteRequest(rawInput);
  const manifestPath = path.join(rootDir, 'portfolio', 'sites.json');
  const manifest = validateManifestShape(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));

  if (manifest.sites.some((site) => site.key === request.key)) throw new Error(`site key already exists: ${request.key}`);
  if (manifest.sites.some((site) => site.productionOrigin === request.domain)) throw new Error(`production origin already exists: ${request.domain}`);
  if (fs.existsSync(path.join(rootDir, request.appDir))) throw new Error(`app directory already exists: ${request.appDir}`);

  writeFile(rootDir, `${request.appDir}/package.json`, packageJson(request));
  writeFile(rootDir, `${request.appDir}/tsconfig.json`, '{\n  "extends": "astro/tsconfigs/strict"\n}\n');
  writeFile(rootDir, `${request.appDir}/astro.config.mjs`, astroConfig(request));
  writeFile(rootDir, `${request.appDir}/site.config.ts`, siteConfig(request));
  writeFile(rootDir, `${request.appDir}/src/layouts/BaseLayout.astro`, baseLayout());
  writeFile(rootDir, `${request.appDir}/src/layouts/ToolPageLayout.astro`, toolPageLayout());
  writeFile(rootDir, `${request.appDir}/src/components/ToolActions.astro`, toolActions());
  writeFile(rootDir, `${request.appDir}/src/components/AdSlot.astro`, adSlot());
  writeFile(rootDir, `${request.appDir}/src/content/static-pages.ts`, staticPages());
  writeFile(rootDir, `${request.appDir}/src/config/runtime-data.ts`, runtimeData());
  writeFile(rootDir, `${request.appDir}/src/tools/registry.ts`, toolRegistry());
  writeFile(rootDir, `${request.appDir}/src/pages/index.astro`, homePage());
  writeFile(rootDir, `${request.appDir}/src/pages/[slug].astro`, staticPageRoute());
  writeFile(rootDir, `${request.appDir}/src/pages/404.astro`, notFoundPage());
  writeFile(rootDir, `${request.appDir}/src/pages/robots.txt.ts`, robotsRoute());
  writeFile(rootDir, `${request.appDir}/src/pages/sitemap.xml.ts`, sitemapRoute());
  writeFile(rootDir, `${request.appDir}/src/styles/global.css`, globalCss());

  manifest.sites.push({
    key: request.key,
    name: request.name,
    appDir: request.appDir,
    packageName: request.packageName,
    productionOrigin: request.domain,
    status: 'scaffold',
  });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return request;
}
