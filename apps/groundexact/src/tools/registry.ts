import {
  engineReadyTools as selectEngineReadyTools,
  liveTools as selectLiveTools,
  pageReadyTools as selectPageReadyTools,
  validateToolDefinitions,
  type ToolDefinition,
} from '@webtools/tool-catalog';

export type { ToolStatus } from '@webtools/tool-catalog';
export type GroundExactToolCategory = 'materials' | 'coverage' | 'structure';
export type ToolSummary = ToolDefinition<GroundExactToolCategory>;

export const tools: ToolSummary[] = validateToolDefinitions([
  { slug: 'mulch-calculator', name: 'Mulch Calculator', description: 'Estimate cubic yards, waste-adjusted order quantity, and bag equivalents.', status: 'page-ready', category: 'materials' },
  { slug: 'gravel-calculator', name: 'Gravel & Stone Calculator', description: 'Estimate volume, weight, waste, and order quantity for aggregate projects.', status: 'page-ready', category: 'materials' },
  { slug: 'topsoil-calculator', name: 'Topsoil Calculator', description: 'Estimate topsoil volume for beds, lawn leveling, and fill projects.', status: 'page-ready', category: 'materials' },
  { slug: 'sod-calculator', name: 'Sod Calculator', description: 'Calculate square footage, waste, rolls or pallets, and purchase quantity.', status: 'page-ready', category: 'coverage' },
  { slug: 'paver-calculator', name: 'Paver Calculator', description: 'Estimate paver count, waste allowance, and project area.', status: 'page-ready', category: 'structure' },
  { slug: 'retaining-wall-calculator', name: 'Retaining Wall Calculator', description: 'Estimate block count, cap blocks, and course requirements.', status: 'page-ready', category: 'structure' },
  { slug: 'fence-calculator', name: 'Fence Material Calculator', description: 'Estimate posts, panels or pickets, rails, and project length.', status: 'page-ready', category: 'structure' },
  { slug: 'fertilizer-calculator', name: 'Fertilizer Coverage Calculator', description: 'Use the product label rate to estimate how much fertilizer to buy.', status: 'page-ready', category: 'coverage' },
  { slug: 'grass-seed-calculator', name: 'Grass Seed Calculator', description: 'Use your seed label rate and lawn area to estimate purchase quantity.', status: 'page-ready', category: 'coverage' },
  { slug: 'cubic-yard-calculator', name: 'Cubic Yard Calculator', description: 'Convert project dimensions and depth into cubic yards and cubic feet.', status: 'page-ready', category: 'materials' },
]);

export const liveTools = selectLiveTools(tools);
export const pageReadyTools = selectPageReadyTools(tools);
export const engineReadyTools = selectEngineReadyTools(tools);
