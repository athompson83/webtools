import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Copy to apps/<site-key>/astro.config.mjs and replace the example origin.
// Keep the configured site origin aligned with site.config.ts.
export default defineConfig({
  site: 'https://replace-domain.example.com',
  output: 'static',
  integrations: [sitemap()],
});
