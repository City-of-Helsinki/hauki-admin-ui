import {
  defineConfig,
  configDefaults,
  coverageConfigDefaults,
} from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
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
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
});
