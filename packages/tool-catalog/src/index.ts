export type ToolStatus = 'live' | 'page-ready' | 'engine-ready' | 'planned';

export interface ToolDefinition<Category extends string = string> {
  slug: string;
  name: string;
  description: string;
  status: ToolStatus;
  category: Category;
}

export function validateToolDefinitions<T extends ToolDefinition>(tools: readonly T[]): T[] {
  const seen = new Set<string>();
  return tools.map((tool) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.slug)) throw new RangeError(`tool slug must be URL-safe lowercase kebab-case: ${tool.slug}`);
    if (!tool.name.trim()) throw new RangeError(`tool name is required for ${tool.slug}`);
    if (!tool.description.trim()) throw new RangeError(`tool description is required for ${tool.slug}`);
    if (!tool.category.trim()) throw new RangeError(`tool category is required for ${tool.slug}`);
    if (seen.has(tool.slug)) throw new RangeError(`duplicate tool slug: ${tool.slug}`);
    seen.add(tool.slug);
    return tool;
  });
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
