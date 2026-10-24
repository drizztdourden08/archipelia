/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);

const buildPackage = async ({ root, entries, external = [] }) => {
  const out = join(root, 'dist');
  await rm(out, { recursive: true, force: true });
  await build({
    entryPoints: Object.fromEntries(Object.entries(entries).map(([name, path]) => [name, join(root, path)])),
    outdir: out,
    bundle: true,
    splitting: true,
    format: 'esm',
    platform: 'node',
    target: 'node24',
    external,
    logLevel: 'warning',
  });
  const tsc = require.resolve('typescript/bin/tsc');
  const declarations = spawnSync(process.execPath, [tsc, '-p', join(root, 'tsconfig.build.json')], { cwd: root, stdio: 'inherit' });
  if (declarations.status !== 0) process.exit(declarations.status ?? 1);
};

export { buildPackage };
