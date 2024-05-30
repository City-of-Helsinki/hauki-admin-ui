import {
  UserConfig,
  defineConfig,
  configDefaults,
  coverageConfigDefaults,
} from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';

export default defineConfig((env) => ({
  base: '/',
  envPrefix: 'REACT_APP_',
  plugins: [react(), env.mode !== 'test' && eslint()] as UserConfig['plugins'],
  build: {
    outDir: './build',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    reporters: ['verbose'],
    coverage: {
      reporter: ['clover', 'json', 'lcov', 'text'],
      include: ['src/**/*'],
      provider: 'istanbul',
      exclude: [...coverageConfigDefaults.exclude, 'src/setupTests.ts'],
    },
    exclude: [...configDefaults.exclude, 'e2e'],
  },
}));
