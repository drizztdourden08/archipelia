/* @layer core @kind logic */
import type { EngineStateFile } from '@archipelia/model';
import { updateEngineState } from './update-engine-state';

const activateEngine = (engineRoot: string, id: string): Promise<EngineStateFile> =>
  updateEngineState(engineRoot, (state) => {
    const target = state.installed.find((entry) => entry.id === id);
    if (!target) throw new Error(`engine ${id} is not installed`);
    if (target.state !== 'ready') throw new Error(`engine ${id} did not pass its checks`);
    if (state.active === id) return state;
    return { ...state, active: id, lastGood: state.active ?? state.lastGood ?? id };
  });

export { activateEngine };
