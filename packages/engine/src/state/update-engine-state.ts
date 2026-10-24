/* @layer core @kind logic */
import type { EngineStateFile } from '@archipelia/model';
import { readEngineState } from './read-engine-state';
import { withStateLock } from './with-state-lock';
import { writeEngineState } from './write-engine-state';

const updateEngineState = (engineRoot: string, change: (state: EngineStateFile) => EngineStateFile): Promise<EngineStateFile> =>
  withStateLock(engineRoot, async () => {
    const next = change(await readEngineState(engineRoot));
    await writeEngineState(engineRoot, next);
    return next;
  });

export { updateEngineState };
