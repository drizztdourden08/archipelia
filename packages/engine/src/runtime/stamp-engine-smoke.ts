/* @layer core @kind logic */
import type { SmokeResult } from '@archipelia/model';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import { RUNTIME_FILE } from './read-runtime.constants';

const stampEngineSmoke = async (engineDir: string, smoke: SmokeResult): Promise<void> => {
  const file = join(engineDir, RUNTIME_FILE);
  const stored: Record<string, unknown> = JSON.parse(stripBom(await readFile(file, 'utf8')));
  await writeFile(file, JSON.stringify({ ...stored, smoke }, null, 2), 'utf8');
};

export { stampEngineSmoke };
