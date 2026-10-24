/* @layer core @kind logic */
import type { EngineStateFile } from '@archipelia/model';
import { updateEngineState } from './update-engine-state';

const markOffered = (engineRoot: string, version: string): Promise<EngineStateFile> =>
  updateEngineState(engineRoot, (state) => ({ ...state, offeredAp: version }));

export { markOffered };
