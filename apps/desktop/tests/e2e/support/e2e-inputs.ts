/* @layer tests @kind helper */
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { activeEngineDir } from '@archipelia/engine';

const ENGINE_DIR_ENV = 'ARCHIPELIA_ENGINE_DIR';

const BUNDLED_ENGINE_ROOT = join(import.meta.dirname, '../../../../../tooling/engine-bundle/dist');

const engineRoots = (): string[] => [...(process.env[ENGINE_DIR_ENV] ? [process.env[ENGINE_DIR_ENV]] : []), BUNDLED_ENGINE_ROOT];

const RELIC_DIR = process.env.ARCHIPELIA_RELIC_DIR;

const e2eEngineDir = async () => {
  const roots = engineRoots();
  const found = await Promise.all(roots.map((root) => activeEngineDir(root)));
  const dir = found.find((candidate) => candidate);
  if (!dir) throw new Error(`no engine in ${roots.join(' or ')}: build one with the engine bundle, or set ${ENGINE_DIR_ENV}`);
  return dir;
};

const relicFiles = async () => {
  if (!RELIC_DIR) throw new Error('set ARCHIPELIA_RELIC_DIR to a folder holding Relic.yaml and relic_of_the_past.apworld, written by rotp');
  const apworld = join(RELIC_DIR, 'relic_of_the_past.apworld');
  const yamlPath = join(RELIC_DIR, 'Relic.yaml');
  await Promise.all([access(apworld), access(yamlPath)]);
  return { apworld, yamlPath };
};

export { e2eEngineDir, relicFiles };
