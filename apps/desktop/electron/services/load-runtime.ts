/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { EngineRuntime } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import { engineInstalled } from './engine-installed';
import { engineDirOf } from './engine-dir-of';

const loadRuntime = async (ctx: MainContext): Promise<EngineRuntime> => {
  if (!(await engineInstalled(ctx))) throw new Error('the engine is not set up yet: open Settings, Engine');
  return readRuntime(engineDirOf(ctx));
};

export { loadRuntime };
