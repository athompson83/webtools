import fs from 'node:fs';
import path from 'node:path';

const engineStatuses = new Set(['engine-ready', 'page-ready', 'live']);
const pageStatuses = new Set(['page-ready', 'live']);

export function parseToolRegistry(source) {
  const tools = [];
  const objectPattern = /\{[^{}]*\bslug:\s*'([^']+)'[^{}]*\bstatus:\s*'(planned|engine-ready|page-ready|live)'[^{}]*\}/g;
  for (const match of source.matchAll(objectPattern)) {
    tools.push({ slug: match[1], status: match[2] });
  }
  return tools;
}

function engineKeyFromSlug(slug) {
  return slug.endsWith('-calculator') ? slug.slice(0, -'-calculator'.length) : slug;
}

function assertFile(filePath, message) {
  if (!fs.existsSync(filePath)) throw new Error(message);
}

export function validateSiteToolSources(rootDir, site) {
  const appDir = path.join(rootDir, site.appDir);
  const registryPath = path.join(appDir, 'src', 'tools', 'registry.ts');
  assertFile(registryPath, `${site.key} is missing src/tools/registry.ts.`);

  const tools = parseToolRegistry(fs.readFileSync(registryPath, 'utf8'));
  let engineReadyOrLater = 0;
  let pageReadyOrLive = 0;

  for (const tool of tools) {
    const engineKey = engineKeyFromSlug(tool.slug);
    const enginePath = path.join(appDir, 'src', 'tools', engineKey, 'calculate.ts');
    const testPath = path.join(appDir, 'src', 'tools', engineKey, 'calculate.test.ts');

    if (engineStatuses.has(tool.status)) {
      engineReadyOrLater += 1;
      assertFile(enginePath, `${site.key}/${tool.slug} is ${tool.status} but missing calculator engine: src/tools/${engineKey}/calculate.ts`);
      assertFile(testPath, `${site.key}/${tool.slug} is ${tool.status} but missing calculator test: src/tools/${engineKey}/calculate.test.ts`);
    }

    if (pageStatuses.has(tool.status)) {
      pageReadyOrLive += 1;
      const pagePath = path.join(appDir, 'src', 'pages', 'tools', `${tool.slug}.astro`);
      assertFile(pagePath, `${site.key}/${tool.slug} is ${tool.status} but missing public tool page.`);
      const pageSource = fs.readFileSync(pagePath, 'utf8');
      if (!pageSource.includes('ToolPageLayout')) {
        throw new Error(`${site.key}/${tool.slug} must use ToolPageLayout before it can be ${tool.status}.`);
      }
      if (!pageSource.includes(`../../tools/${engineKey}/calculate`)) {
        throw new Error(`${site.key}/${tool.slug} must import its production calculator module before it can be ${tool.status}.`);
      }
      if (!pageSource.includes('slot="methodology"')) {
        throw new Error(`${site.key}/${tool.slug} is missing visible methodology content.`);
      }
      if (!pageSource.includes('slot="example"')) {
        throw new Error(`${site.key}/${tool.slug} is missing a worked example.`);
      }
      if (!pageSource.includes('reviewedDate=')) {
        throw new Error(`${site.key}/${tool.slug} is missing a reviewed date.`);
      }
      if (!pageSource.includes('data-error')) {
        throw new Error(`${site.key}/${tool.slug} must expose an inline error region for invalid inputs.`);
      }
    }
  }

  return { siteKey: site.key, tools: tools.length, engineReadyOrLater, pageReadyOrLive };
}
