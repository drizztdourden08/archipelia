/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { build } from 'esbuild';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'dist');
const require = createRequire(import.meta.url);

await rm(OUT, { recursive: true, force: true });

await build({
  entryPoints: { index: join(ROOT, 'src/index.ts'), node: join(ROOT, 'src/node/index.ts'), testing: join(ROOT, 'src/testing/index.ts') },
  outdir: OUT,
  bundle: true,
  splitting: true,
  format: 'esm',
  platform: 'node',
  target: 'node24',
  logLevel: 'warning',
});

const tsc = require.resolve('typescript/bin/tsc');
const declarations = spawnSync(process.execPath, [tsc, '-p', join(ROOT, 'tsconfig.build.json')], { cwd: ROOT, stdio: 'inherit' });
if (declarations.status !== 0) process.exit(declarations.status ?? 1);
