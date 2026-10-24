/* @layer core @kind logic */
import type { EngineStateFile, InstalledEngine } from '@archipelia/model';
import { updateEngineState } from './update-engine-state';

const registerEngine = (engineRoot: string, engine: InstalledEngine): Promise<EngineStateFile> =>
  updateEngineState(engineRoot, (state) => ({
    ...state,
    installed: [...state.installed.filter((entry) => entry.id !== engine.id), engine],
  }));

export { registerEngine };
