import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

/* Dev server only. The stylesheet is one entry file (src/styles/index.css)
   that imports all the others, and the dev server puts a copy of it into
   every page it serves. A change to an IMPORTED file did not refresh that
   copy: pages were served with the previous styles, and the current ones
   were swapped in a frame later -- a flash, and every transition playing
   on every page load. So when any other stylesheet changes, the entry
   file is marked as changed too, which makes the server rebuild its copy. */
const entry = path.resolve('src/styles/index.css');
const freshStyles = {
  name: 'fresh-styles',
  apply: 'serve',
  handleHotUpdate({ file }) {
    if (file.endsWith('.css') && file.includes('/src/styles/') && path.resolve(file) !== entry) {
      const now = new Date();
      fs.utimesSync(entry, now, now);
    }
  },
};

export default defineConfig({
  // The real address: canonical links, sharing tags, structured data and
  // the sitemap are all built from it. (Not www.: that redirects here.)
  site: 'https://cristianserrano.ar',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/styleguide') && !page.includes('/template') && !page.includes('/work/justrelate/') })],
  vite: { plugins: [freshStyles] },
  build: {
    // Always emit CSS as files. Inlined <style> would be blocked by the
    // Content-Security-Policy in public/_headers (style-src 'self').
    inlineStylesheets: 'never',
  },
});
