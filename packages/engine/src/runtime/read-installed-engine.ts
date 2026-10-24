/* @layer core @kind logic */
import type { InstalledEngine } from '@archipelia/model';
import { readEngineMeta } from './read-engine-meta';
import { readRuntime } from './read-runtime';

const readInstalledEngine = async (engineDir: string): Promise<InstalledEngine> => {
  const [runtime, meta] = await Promise.all([readRuntime(engineDir), readEngineMeta(engineDir)]);
  return {
    id: runtime.id,
    ap: runtime.apVersion,
    apCommit: runtime.apCommit,
    python: runtime.pythonVersion,
    pythonRelease: meta.pythonRelease,
    target: meta.target,
    builtAt: meta.builtAt,
    state: 'ready',
    ...(meta.smoke ? { smoke: meta.smoke } : {}),
  };
};

export { readInstalledEngine };
