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

function canonicalUrlsFromHtml(html) {
  return [...html.matchAll(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
}

function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
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
  if (!fs.existsSync(robotsPath)) throw new Error(`${site.key} build is missing robots.txt.`);
  if (!fs.existsSync(sitemapPath)) throw new Error(`${site.key} build is missing sitemap.xml.`);

  const robots = fs.readFileSync(robotsPath, 'utf8');
  const expectedSitemap = `Sitemap: ${site.productionOrigin}/sitemap.xml`;
  if (!robots.includes(expectedSitemap)) throw new Error(`${site.key} robots.txt does not reference its own sitemap.`);

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const loc of sitemapLocs(sitemap)) {
    const url = new URL(loc);
    if (url.origin !== site.productionOrigin) throw new Error(`${site.key} sitemap contains foreign origin: ${url.origin}`);
    if (url.search || url.hash) throw new Error(`${site.key} sitemap contains non-canonical URL: ${loc}`);
  }

  const htmlFiles = walkFiles(distDir).filter((file) => file.endsWith('.html'));
  if (htmlFiles.length === 0) throw new Error(`${site.key} build contains no HTML files.`);
  const foreignOrigins = manifest.sites.filter((entry) => entry.key !== site.key).map((entry) => entry.productionOrigin);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const canonical of canonicalUrlsFromHtml(html)) {
      const url = new URL(canonical);
      if (url.origin !== site.productionOrigin) throw new Error(`${site.key} canonical points to foreign origin in ${path.relative(distDir, file)}: ${url.origin}`);
      if (url.search || url.hash) throw new Error(`${site.key} canonical contains query or fragment in ${path.relative(distDir, file)}.`);
    }

    for (const foreignOrigin of foreignOrigins) {
      if (html.includes(foreignOrigin)) throw new Error(`${site.key} build contains another portfolio origin in ${path.relative(distDir, file)}: ${foreignOrigin}`);
    }
  }

  return { siteKey: site.key, productionOrigin: site.productionOrigin, htmlFiles: htmlFiles.length };
}
