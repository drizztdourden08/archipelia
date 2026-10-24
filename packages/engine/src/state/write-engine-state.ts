/* @layer core @kind logic */
import type { EngineStateFile } from '@archipelia/model';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { STATE_FILE } from './engine-state.constants';

const writeEngineState = async (engineRoot: string, state: EngineStateFile): Promise<void> => {
  await mkdir(engineRoot, { recursive: true });
  const file = join(engineRoot, STATE_FILE);
  await writeFile(`${file}.part`, JSON.stringify(state, null, 2), 'utf8');
  await rename(`${file}.part`, file);
};

export { writeEngineState };
