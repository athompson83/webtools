export type ToolStatus = 'live' | 'page-ready' | 'engine-ready' | 'planned';

export interface ToolDefinition<Category extends string = string> {
  slug: string;
  name: string;
  description: string;
  status: ToolStatus;
  category: Category;
  reviewedOn?: string;
}

const forwardLifecycle: ToolStatus[] = ['planned', 'engine-ready', 'page-ready', 'live'];
const publishableStatuses = new Set<ToolStatus>(['page-ready', 'live']);

function isIsoCalendarDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateToolDefinitions<T extends ToolDefinition>(tools: readonly T[]): T[] {
  const seen = new Set<string>();
  return tools.map((tool) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.slug)) throw new RangeError(`tool slug must be URL-safe lowercase kebab-case: ${tool.slug}`);
    if (!tool.name.trim()) throw new RangeError(`tool name is required for ${tool.slug}`);
    if (!tool.description.trim()) throw new RangeError(`tool description is required for ${tool.slug}`);
    if (!tool.category.trim()) throw new RangeError(`tool category is required for ${tool.slug}`);
    if (publishableStatuses.has(tool.status) && !isIsoCalendarDate(tool.reviewedOn)) {
      throw new RangeError(`reviewedOn must be a valid ISO calendar date for ${tool.slug}`);
    }
    if (seen.has(tool.slug)) throw new RangeError(`duplicate tool slug: ${tool.slug}`);
    seen.add(tool.slug);
    return tool;
  });
}

export function assertToolStatusTransition(current: ToolStatus, next: ToolStatus): void {
  if (current === next) return;
  const currentIndex = forwardLifecycle.indexOf(current);
  const nextIndex = forwardLifecycle.indexOf(next);
  if (nextIndex < currentIndex) return;
  if (nextIndex !== currentIndex + 1) {
    throw new Error(`tool status promotion cannot skip lifecycle gates: ${current} -> ${next}`);
  }
}

export function toolPath(slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new RangeError(`invalid tool slug: ${slug}`);
  return `/tools/${slug}`;
}

export function liveTools<T extends ToolDefinition>(tools: readonly T[]): T[] {
  return tools.filter((tool) => tool.status === 'live');
}

export function pageReadyTools<T extends ToolDefinition>(tools: readonly T[]): T[] {
  return tools.filter((tool) => tool.status === 'page-ready');
}

export function engineReadyTools<T extends ToolDefinition>(tools: readonly T[]): T[] {
  return tools.filter((tool) => tool.status === 'engine-ready');
}

export function relatedLiveTools<T extends ToolDefinition>(tools: readonly T[], currentSlug: string, limit = 3): T[] {
  const current = tools.find((tool) => tool.slug === currentSlug);
  if (!current) return [];
  return tools
    .filter((tool) => tool.status === 'live' && tool.slug !== current.slug && tool.category === current.category)
    .slice(0, limit);
}
