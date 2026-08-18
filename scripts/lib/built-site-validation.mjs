import fs from 'node:fs';
import path from 'node:path';
import { validateManifestShape } from './portfolio-validation.mjs';

function walkFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(absolute));
    else files.push(absolute);
  }
  return files;
}

function attributeValue(tag, attribute) {
  const pattern = new RegExp(`\\b${attribute}=["']([^"']*)["']`, 'i');
  return tag.match(pattern)?.[1] ?? null;
}

function canonicalUrlsFromHtml(html) {
  const tags = [...html.matchAll(/<link\s+[^>]*>/gi)].map((match) => match[0]);
  const urls = [];
  for (const tag of tags) {
    const rel = attributeValue(tag, 'rel')?.toLowerCase().split(/\s+/) ?? [];
    if (!rel.includes('canonical')) continue;
    const href = attributeValue(tag, 'href');
    if (href) urls.push(href);
  }
  return urls;
}

function anchorHrefsFromHtml(html) {
  return [...html.matchAll(/<a\s+[^>]*>/gi)]
    .map((match) => attributeValue(match[0], 'href'))
    .filter((href) => href !== null);
}

function robotsMetaContentsFromHtml(html) {
  const tags = [...html.matchAll(/<meta\s+[^>]*>/gi)].map((match) => match[0]);
  const contents = [];
  for (const tag of tags) {
    const name = attributeValue(tag, 'name')?.toLowerCase();
    if (name !== 'robots') continue;
    const content = attributeValue(tag, 'content');
    if (content !== null) contents.push(content.toLowerCase());
  }
  return contents;
}

function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function builtPathExists(distDir, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const relative = decoded.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!relative) return fs.existsSync(path.join(distDir, 'index.html'));

  const candidates = path.extname(relative)
    ? [path.join(distDir, relative)]
    : [
        path.join(distDir, relative, 'index.html'),
        path.join(distDir, `${relative}.html`),
        path.join(distDir, relative),
      ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

function isNoindex(robotsMeta) {
  return robotsMeta.some((content) => content.split(',').map((value) => value.trim()).includes('noindex'));
}

export function validateBuiltSite(rootDir, siteKey) {
  const manifestPath = path.join(rootDir, 'portfolio', 'sites.json');
  const manifest = validateManifestShape(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
  const site = manifest.sites.find((entry) => entry.key === siteKey);
  if (!site) throw new Error(`Unknown portfolio site key: ${siteKey}`);

  const distDir = path.join(rootDir, site.appDir, 'dist');
  if (!fs.existsSync(distDir)) throw new Error(`Missing build output: ${site.appDir}/dist`);

  const robotsPath = path.join(distDir, 'robots.txt');
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  const adsTxtPath = path.join(distDir, 'ads.txt');
  if (!fs.existsSync(robotsPath)) throw new Error(`${site.key} build is missing robots.txt.`);
  if (!fs.existsSync(sitemapPath)) throw new Error(`${site.key} build is missing sitemap.xml.`);
  if (!fs.existsSync(adsTxtPath)) throw new Error(`${site.key} build is missing ads.txt.`);

  const robots = fs.readFileSync(robotsPath, 'utf8');
  const expectedSitemap = `Sitemap: ${site.productionOrigin}/sitemap.xml`;
  if (!robots.includes(expectedSitemap)) throw new Error(`${site.key} robots.txt does not reference its own sitemap.`);

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const sitemapUrls = sitemapLocs(sitemap);
  const sitemapUrlSet = new Set(sitemapUrls);
  for (const loc of sitemapUrls) {
    const url = new URL(loc);
    if (url.origin !== site.productionOrigin) throw new Error(`${site.key} sitemap contains foreign origin: ${url.origin}`);
    if (url.search || url.hash) throw new Error(`${site.key} sitemap contains non-canonical URL: ${loc}`);
  }

  const htmlFiles = walkFiles(distDir).filter((file) => file.endsWith('.html'));
  if (htmlFiles.length === 0) throw new Error(`${site.key} build contains no HTML files.`);
  const foreignOrigins = manifest.sites.filter((entry) => entry.key !== site.key).map((entry) => entry.productionOrigin);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const relativeFile = path.relative(distDir, file);
    const canonicals = canonicalUrlsFromHtml(html);
    const robotsMeta = robotsMetaContentsFromHtml(html);

    if (canonicals.length !== 1) {
      throw new Error(`${site.key} built HTML must contain exactly one canonical URL in ${relativeFile}; found ${canonicals.length}.`);
    }

    const canonical = canonicals[0];
    const canonicalUrl = new URL(canonical);
    if (canonicalUrl.origin !== site.productionOrigin) throw new Error(`${site.key} canonical points to foreign origin in ${relativeFile}: ${canonicalUrl.origin}`);
    if (canonicalUrl.search || canonicalUrl.hash) throw new Error(`${site.key} canonical contains query or fragment in ${relativeFile}.`);
    if (isNoindex(robotsMeta) && sitemapUrlSet.has(canonical)) {
      throw new Error(`${site.key} noindex page appears in sitemap: ${canonical}`);
    }

    for (const href of anchorHrefsFromHtml(html)) {
      let target;
      try {
        target = new URL(href, canonical);
      } catch {
        throw new Error(`${site.key} invalid link in ${relativeFile}: ${href}`);
      }
      if (!['http:', 'https:'].includes(target.protocol)) continue;
      if (target.origin !== site.productionOrigin) continue;
      if (!builtPathExists(distDir, target.pathname)) {
        throw new Error(`${site.key} broken internal link in ${relativeFile}: ${href}`);
      }
    }

    for (const foreignOrigin of foreignOrigins) {
      if (html.includes(foreignOrigin)) throw new Error(`${site.key} build contains another portfolio origin in ${relativeFile}: ${foreignOrigin}`);
    }
  }

  return { siteKey: site.key, productionOrigin: site.productionOrigin, htmlFiles: htmlFiles.length };
}
