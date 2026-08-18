import { describe, expect, it } from 'vitest';
import { relatedLiveTools, toolPath, validateToolDefinitions } from './index';

describe('tool catalog', () => {
  const tools = validateToolDefinitions([
    { slug: 'mulch-calculator', name: 'Mulch Calculator', description: 'Mulch.', status: 'live', category: 'materials' },
    { slug: 'gravel-calculator', name: 'Gravel Calculator', description: 'Gravel.', status: 'live', category: 'materials' },
    { slug: 'sod-calculator', name: 'Sod Calculator', description: 'Sod.', status: 'page-ready', category: 'coverage' },
  ]);

  it('builds the canonical tool path from a slug', () => {
    expect(toolPath('mulch-calculator')).toBe('/tools/mulch-calculator');
  });

  it('returns only live related tools in the same category', () => {
    expect(relatedLiveTools(tools, 'mulch-calculator').map((tool) => tool.slug)).toEqual(['gravel-calculator']);
  });

  it('rejects duplicate tool slugs', () => {
    expect(() => validateToolDefinitions([
      { slug: 'same', name: 'One', description: 'One', status: 'planned', category: 'a' },
      { slug: 'same', name: 'Two', description: 'Two', status: 'planned', category: 'b' },
    ])).toThrow(/duplicate tool slug/i);
  });

  it('rejects unsafe slugs', () => {
    expect(() => validateToolDefinitions([
      { slug: '../escape', name: 'Bad', description: 'Bad', status: 'planned', category: 'a' },
    ])).toThrow(/tool slug/i);
  });
});
