/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { RUNTIME_FILE } from '@archipelia/engine';

const officialDir = async (engineDir: string) => {
  const runtime: unknown = JSON.parse(await readFile(join(engineDir, RUNTIME_FILE), 'utf8'));
  if (!isRecord(runtime) || typeof runtime.official !== 'string') {
    throw new Error(`${RUNTIME_FILE} has no official worlds folder; rebuild the engine`);
  }
  return resolve(engineDir, runtime.official);
};

export { officialDir };
