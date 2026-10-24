/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { buildPackage } from '@archipelia/package-build';

await buildPackage({
  root: join(import.meta.dirname, '..'),
  entries: { index: 'src/index.ts', node: 'src/node/index.ts', testing: 'src/testing/index.ts' },
});
