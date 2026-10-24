/* @layer tests @kind helper */
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { activeEngineDir } from '@archipelia/engine';

const ENGINE_ROOT = join(import.meta.dirname, '../../../../../tooling/engine-bundle/dist');

const RELIC_DIR = process.env.ARCHIPELIA_RELIC_DIR;

const e2eEngineDir = async () => {
  const dir = await activeEngineDir(ENGINE_ROOT);
  if (!dir) throw new Error(`no engine in ${ENGINE_ROOT}: build one with the engine bundle, or set ARCHIPELIA_ENGINE_DIR`);
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
