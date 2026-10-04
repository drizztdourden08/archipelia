/* @layer tooling-scripts @kind logic */
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { BUNDLE_DIR } from './pins.mjs';

const SCHEMA_SCRIPT = 'archipelia/options_schema.py';
const SCHEMA_SOURCE = join(BUNDLE_DIR, 'py', 'options_schema.py');

const installSchemaScript = async (out) => {
  const target = join(out, SCHEMA_SCRIPT);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(SCHEMA_SOURCE, target);
  return SCHEMA_SCRIPT;
};

export { installSchemaScript };
