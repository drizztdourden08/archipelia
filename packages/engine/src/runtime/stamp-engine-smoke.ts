/* @layer core @kind logic */
import type { SmokeResult } from '@archipelia/model';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isRecord } from '@archipelia/model';
import { parseJson } from './parse-json';
import { RUNTIME_FILE } from './read-runtime.constants';

const stampEngineSmoke = async (engineDir: string, smoke: SmokeResult): Promise<void> => {
  const file = join(engineDir, RUNTIME_FILE);
  const stored = parseJson(await readFile(file, 'utf8'), isRecord, RUNTIME_FILE);
  await writeFile(file, JSON.stringify({ ...stored, smoke }, null, 2), 'utf8');
};

export { stampEngineSmoke };
