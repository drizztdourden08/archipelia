/* @layer tooling-scripts @kind logic */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { OPTIONS_SCHEMA_SOURCE } from './options-schema-source.constants.mjs';

const SCHEMA_SCRIPT = 'archipelia/options_schema.py';

const installSchemaScript = async (out) => {
  const target = join(out, SCHEMA_SCRIPT);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, OPTIONS_SCHEMA_SOURCE, 'utf8');
  return SCHEMA_SCRIPT;
};

export { installSchemaScript };
