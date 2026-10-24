/* @layer core @kind logic */
import type { EngineStateFile } from '@archipelia/model';
import { updateEngineState } from './update-engine-state';

const forgetEngine = (engineRoot: string, id: string): Promise<EngineStateFile> =>
  updateEngineState(engineRoot, (state) => {
    if (state.active === id) throw new Error('the active engine cannot be removed');
    const { lastGood, ...rest } = state;
    return {
      ...rest,
      ...(lastGood && lastGood !== id ? { lastGood } : {}),
      installed: state.installed.filter((entry) => entry.id !== id),
    };
  });

export { forgetEngine };
