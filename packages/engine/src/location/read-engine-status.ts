/* @layer core @kind logic */
import type { EngineStatus } from '@archipelia/model';
import { engineInstalled } from './engine-installed';
import { loadRuntime } from './load-runtime';

const readEngineStatus = async (engineDir: string): Promise<EngineStatus> => {
  if (!(await engineInstalled(engineDir))) return { state: 'missing', dir: engineDir };
  try {
    const runtime = await loadRuntime(engineDir);
    return { state: 'ready', dir: engineDir, id: runtime.id, apVersion: runtime.apVersion, pythonVersion: runtime.pythonVersion };
  } catch (err) {
    return { state: 'failed', dir: engineDir, error: (err as Error).message };
  }
};

export { readEngineStatus };
