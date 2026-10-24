/* @layer electron-main @kind logic */
import {
  activeEngineDir, ENGINE_DIR_ENV, findInstalledEngine, loadActiveRuntime, loadEngineRuntime, readEngineState,
} from '@archipelia/engine';
import type { EngineRuntime, SessionEngine } from '@archipelia/model';
import { ENGINE_TEXT } from './engine-text.constants';

const createEngineRuntimes = (root: string, target: string) => {
  const runtime = () => loadActiveRuntime(root);

  const engineDir = async () => {
    const dir = await activeEngineDir(root);
    if (!dir) throw new Error(ENGINE_TEXT.notSetUp);
    return dir;
  };

  const runtimeFor = async (engine: SessionEngine): Promise<EngineRuntime | undefined> => {
    if (process.env[ENGINE_DIR_ENV]) return undefined;
    const state = await readEngineState(root);
    const found = engine.id
      ? state.installed.find((entry) => entry.id === engine.id)
      : findInstalledEngine(state, engine.ap, engine.python, target);
    if (found?.state !== 'ready') return undefined;
    return loadEngineRuntime(root, found.id).catch(() => undefined);
  };

  return { engineDir, runtime, runtimeFor };
};

export { createEngineRuntimes };
