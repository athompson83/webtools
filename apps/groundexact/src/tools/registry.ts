export type ToolStatus = 'live' | 'engine-ready' | 'planned';

export interface ToolSummary {
  slug: string;
  name: string;
  description: string;
  status: ToolStatus;
  category: 'materials' | 'coverage' | 'structure';
}

export const tools: ToolSummary[] = [
  { slug: 'mulch-calculator', name: 'Mulch Calculator', description: 'Estimate cubic yards, waste-adjusted order quantity, and bag equivalents.', status: 'live', category: 'materials' },
  { slug: 'gravel-calculator', name: 'Gravel & Stone Calculator', description: 'Estimate volume, weight, waste, and order quantity for aggregate projects.', status: 'engine-ready', category: 'materials' },
  { slug: 'topsoil-calculator', name: 'Topsoil Calculator', description: 'Estimate topsoil volume for beds, lawn leveling, and fill projects.', status: 'engine-ready', category: 'materials' },
  { slug: 'sod-calculator', name: 'Sod Calculator', description: 'Calculate square footage, waste, rolls or pallets, and purchase quantity.', status: 'engine-ready', category: 'coverage' },
  { slug: 'paver-calculator', name: 'Paver Calculator', description: 'Estimate paver count, waste allowance, and project area.', status: 'engine-ready', category: 'structure' },
  { slug: 'retaining-wall-calculator', name: 'Retaining Wall Calculator', description: 'Estimate block count, cap blocks, and course requirements.', status: 'engine-ready', category: 'structure' },
  { slug: 'fence-calculator', name: 'Fence Material Calculator', description: 'Estimate posts, panels or pickets, rails, and project length.', status: 'engine-ready', category: 'structure' },
  { slug: 'fertilizer-calculator', name: 'Fertilizer Coverage Calculator', description: 'Use the product label rate to estimate how much fertilizer to buy.', status: 'engine-ready', category: 'coverage' },
  { slug: 'grass-seed-calculator', name: 'Grass Seed Calculator', description: 'Use your seed label rate and lawn area to estimate purchase quantity.', status: 'engine-ready', category: 'coverage' },
  { slug: 'cubic-yard-calculator', name: 'Cubic Yard Calculator', description: 'Convert project dimensions and depth into cubic yards and cubic feet.', status: 'engine-ready', category: 'materials' },
];

export const liveTools = tools.filter((tool) => tool.status === 'live');
export const engineReadyTools = tools.filter((tool) => tool.status === 'engine-ready');
