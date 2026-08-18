import { describe, expect, it } from 'vitest';
import { assertToolStatusTransition, relatedLiveTools, toolPath, validateToolDefinitions } from './index';

describe('tool catalog', () => {
  const tools = validateToolDefinitions([
    { slug: 'mulch-calculator', name: 'Mulch Calculator', description: 'Mulch.', status: 'live', category: 'materials', reviewedOn: '2026-08-18' },
    { slug: 'gravel-calculator', name: 'Gravel Calculator', description: 'Gravel.', status: 'live', category: 'materials', reviewedOn: '2026-08-18' },
    { slug: 'sod-calculator', name: 'Sod Calculator', description: 'Sod.', status: 'page-ready', category: 'coverage', reviewedOn: '2026-08-18' },
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

  it('requires a valid ISO review date before a tool can be page-ready or live', () => {
    expect(() => validateToolDefinitions([
      { slug: 'missing-review', name: 'Missing Review', description: 'Missing.', status: 'page-ready', category: 'a' },
    ])).toThrow(/reviewedOn/i);
    expect(() => validateToolDefinitions([
      { slug: 'bad-review', name: 'Bad Review', description: 'Bad.', status: 'live', category: 'a', reviewedOn: '08/18/2026' },
    ])).toThrow(/reviewedOn/i);
    expect(() => validateToolDefinitions([
      { slug: 'bad-calendar-date', name: 'Bad Calendar Date', description: 'Bad.', status: 'live', category: 'a', reviewedOn: '2026-02-31' },
    ])).toThrow(/reviewedOn/i);
  });

  it('allows planned and engine-ready tools to omit a review date', () => {
    expect(() => validateToolDefinitions([
      { slug: 'future-tool', name: 'Future Tool', description: 'Future.', status: 'planned', category: 'a' },
      { slug: 'engine-tool', name: 'Engine Tool', description: 'Engine.', status: 'engine-ready', category: 'a' },
    ])).not.toThrow();
  });

  it('allows one-step forward promotions and emergency demotions', () => {
    expect(() => assertToolStatusTransition('planned', 'engine-ready')).not.toThrow();
    expect(() => assertToolStatusTransition('engine-ready', 'page-ready')).not.toThrow();
    expect(() => assertToolStatusTransition('page-ready', 'live')).not.toThrow();
    expect(() => assertToolStatusTransition('live', 'page-ready')).not.toThrow();
    expect(() => assertToolStatusTransition('live', 'planned')).not.toThrow();
  });

  it('rejects skipped forward promotions', () => {
    expect(() => assertToolStatusTransition('planned', 'page-ready')).toThrow(/cannot skip/i);
    expect(() => assertToolStatusTransition('engine-ready', 'live')).toThrow(/cannot skip/i);
  });
});
