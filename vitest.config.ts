/* @layer root-config @kind config */
import { defineBrockVitestConfig } from '@drizztdourden08/brock-build/vitest';

export default defineBrockVitestConfig(
  import.meta.dirname,
  {
    test: {
      include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', 'apps/desktop/tests/e2e/**/*.e2e.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.*/**'],
    },
  },
  { appDir: 'apps/desktop' },
);
