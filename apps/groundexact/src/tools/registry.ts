export interface ToolSummary {
  slug: string;
  name: string;
  description: string;
  status: 'implemented' | 'planned';
  category: 'materials' | 'coverage' | 'structure';
}

export const tools: ToolSummary[] = [
  { slug: 'mulch-calculator', name: 'Mulch Calculator', description: 'Estimate cubic yards, waste-adjusted order quantity, and bag equivalents.', status: 'implemented', category: 'materials' },
  { slug: 'gravel-calculator', name: 'Gravel & Stone Calculator', description: 'Estimate volume, weight, waste, and order quantity for aggregate projects.', status: 'planned', category: 'materials' },
  { slug: 'topsoil-calculator', name: 'Topsoil Calculator', description: 'Estimate topsoil volume for beds, lawn leveling, and fill projects.', status: 'planned', category: 'materials' },
  { slug: 'sod-calculator', name: 'Sod Calculator', description: 'Calculate square footage, waste, rolls or pallets, and purchase quantity.', status: 'planned', category: 'coverage' },
  { slug: 'paver-calculator', name: 'Paver Calculator', description: 'Estimate paver count, waste allowance, and project area.', status: 'planned', category: 'structure' },
  { slug: 'retaining-wall-calculator', name: 'Retaining Wall Calculator', description: 'Estimate block count, cap blocks, and course requirements.', status: 'planned', category: 'structure' },
  { slug: 'fence-calculator', name: 'Fence Material Calculator', description: 'Estimate posts, panels or pickets, rails, and project length.', status: 'planned', category: 'structure' },
  { slug: 'fertilizer-calculator', name: 'Fertilizer Coverage Calculator', description: 'Use the product label rate to estimate how much fertilizer to buy.', status: 'planned', category: 'coverage' },
  { slug: 'grass-seed-calculator', name: 'Grass Seed Calculator', description: 'Use your seed label rate and lawn area to estimate purchase quantity.', status: 'planned', category: 'coverage' },
  { slug: 'cubic-yard-calculator', name: 'Cubic Yard Calculator', description: 'Convert project dimensions and depth into cubic yards and cubic feet.', status: 'planned', category: 'materials' },
];

export const implementedTools = tools.filter((tool) => tool.status === 'implemented');
