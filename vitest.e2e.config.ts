/* @layer root-config @kind config */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/tests/e2e/**/*.e2e.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 600000,
    hookTimeout: 600000,
    fileParallelism: false,
  },
});
