import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from '@nabla/vite-plugin-eslint';

export default defineConfig({
  base: '/',
  envPrefix: 'REACT_APP_',
  plugins: [react(), eslint()],
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
});
