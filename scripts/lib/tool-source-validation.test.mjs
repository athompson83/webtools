import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseToolRegistry, validateSiteToolSources } from './tool-source-validation.mjs';

function makeFixture(status = 'page-ready') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'webtools-tools-'));
  const appDir = path.join(root, 'apps', 'example');
  fs.mkdirSync(path.join(appDir, 'src', 'tools', 'mulch'), { recursive: true });
  fs.mkdirSync(path.join(appDir, 'src', 'pages', 'tools'), { recursive: true });
  fs.writeFileSync(path.join(appDir, 'src', 'tools', 'registry.ts'), `
export const tools = [
  { slug: 'mulch-calculator', name: 'Mulch Calculator', description: 'Mulch.', status: '${status}', category: 'materials' },
];
`);
  fs.writeFileSync(path.join(appDir, 'src', 'tools', 'mulch', 'calculate.ts'), 'export function calculateMulch() { return 1; }\n');
  fs.writeFileSync(path.join(appDir, 'src', 'tools', 'mulch', 'calculate.test.ts'), 'test("mulch", () => {});\n');
  fs.writeFileSync(path.join(appDir, 'src', 'pages', 'tools', 'mulch-calculator.astro'), `
---
import ToolPageLayout from '../../layouts/ToolPageLayout.astro';
---
<ToolPageLayout title="Mulch" description="Mulch" pathname="/tools/mulch-calculator" intro="Mulch" reviewedDate="August 18, 2026" formulaSummary="Formula">
  <form slot="calculator" data-error></form>
  <div slot="results"></div>
  <div slot="methodology">Method</div>
  <section slot="example">Example</section>
</ToolPageLayout>
<script>
  import { calculateMulch } from '../../tools/mulch/calculate';
  calculateMulch();
</script>
`);
  return root;
}

test('parses tool slugs and statuses from the standard registry form', () => {
  const tools = parseToolRegistry(`
    { slug: 'mulch-calculator', name: 'Mulch', description: 'M', status: 'page-ready', category: 'materials' },
    { slug: 'sod-calculator', name: 'Sod', description: 'S', status: 'planned', category: 'coverage' },
  `);
  assert.deepEqual(tools, [
    { slug: 'mulch-calculator', status: 'page-ready' },
    { slug: 'sod-calculator', status: 'planned' },
  ]);
});

test('accepts a page-ready tool with engine, tests, and complete page contract', () => {
  const root = makeFixture();
  try {
    const result = validateSiteToolSources(root, { key: 'example', appDir: 'apps/example' });
    assert.equal(result.pageReadyOrLive, 1);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('requires an engine and engine test for engine-ready or later tools', () => {
  const root = makeFixture('engine-ready');
  try {
    fs.rmSync(path.join(root, 'apps', 'example', 'src', 'tools', 'mulch', 'calculate.test.ts'));
    assert.throws(() => validateSiteToolSources(root, { key: 'example', appDir: 'apps/example' }), /missing calculator test/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('requires page-ready pages to import their production calculator module', () => {
  const root = makeFixture();
  try {
    const page = path.join(root, 'apps', 'example', 'src', 'pages', 'tools', 'mulch-calculator.astro');
    fs.writeFileSync(page, fs.readFileSync(page, 'utf8').replace("import { calculateMulch } from '../../tools/mulch/calculate';", ''));
    assert.throws(() => validateSiteToolSources(root, { key: 'example', appDir: 'apps/example' }), /production calculator module/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('requires page-ready pages to include methodology and worked example content', () => {
  const root = makeFixture();
  try {
    const page = path.join(root, 'apps', 'example', 'src', 'pages', 'tools', 'mulch-calculator.astro');
    fs.writeFileSync(page, fs.readFileSync(page, 'utf8').replace('slot="example"', 'slot="removed"'));
    assert.throws(() => validateSiteToolSources(root, { key: 'example', appDir: 'apps/example' }), /worked example/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
