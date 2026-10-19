import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@nabla/vite-plugin-eslint';
import { thirdPartyLicenses } from '@city-of-helsinki/license-notices';

import { thirdPartyLicensesConfig } from './scripts/thirdPartyLicenses.config';

export default defineConfig(() => ({
  base: '/',
  envPrefix: 'REACT_APP_',
  plugins: [
    react(),
    eslint(),
    thirdPartyLicenses(thirdPartyLicensesConfig),
  ].filter(Boolean),
  build: {
    outDir: './build',
    emptyOutDir: true,
    sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import'],
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
}));
