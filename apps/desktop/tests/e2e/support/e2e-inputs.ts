/* @layer tests @kind helper */
import { access } from 'node:fs/promises';
import { join } from 'node:path';

const ENGINE_DIR = process.env.ARCHIPELIA_ENGINE_DIR ?? join(import.meta.dirname, '../../../../../tooling/engine-bundle/dist/0.6.7-win32-x64');

const RELIC_DIR = process.env.ARCHIPELIA_RELIC_DIR;

const relicFiles = async () => {
  if (!RELIC_DIR) throw new Error('set ARCHIPELIA_RELIC_DIR to a folder holding Relic.yaml and relic_of_the_past.apworld, written by rotp');
  const apworld = join(RELIC_DIR, 'relic_of_the_past.apworld');
  const yamlPath = join(RELIC_DIR, 'Relic.yaml');
  await Promise.all([access(apworld), access(yamlPath)]);
  return { apworld, yamlPath };
};

export { ENGINE_DIR, relicFiles };
