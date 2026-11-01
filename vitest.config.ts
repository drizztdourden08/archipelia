/* @layer root-config @kind config */
import { defineBrockVitestConfig } from '@drizztdourden08/brock-build/vitest';
import { defineStandardsVitest } from '@drizztdourden08/standards/vitest';

export default defineBrockVitestConfig(
  import.meta.dirname,
  defineStandardsVitest({
    test: {
      include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', 'apps/desktop/tests/e2e/**/*.e2e.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.worktrees/**', '**/.claude/**'],
    },
  }),
  { appDir: 'apps/desktop' },
);
