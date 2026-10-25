/* @layer core @kind logic */
import type { EngineStateFile } from '@archipelia/model';
import { updateEngineState } from './update-engine-state';

const forgetEngine = (engineRoot: string, id: string): Promise<EngineStateFile> =>
  updateEngineState(engineRoot, (state) => {
    const { lastGood, active, ...rest } = state;
    return {
      ...rest,
      ...(active && active !== id ? { active } : {}),
      ...(lastGood && lastGood !== id ? { lastGood } : {}),
      installed: state.installed.filter((entry) => entry.id !== id),
    };
  });

export { forgetEngine };
