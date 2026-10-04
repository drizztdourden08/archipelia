/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { ENGINE_DIR_ENV, readEngineStatus } from '@archipelia/engine';
import { buildEngine } from '@archipelia/engine-bundle';
import type { EngineStatus } from '@archipelia/model';
import { engineDirOf } from './engine-dir-of';
import { engineRoot } from './engine-root';

const setUpEngine = async (ctx: MainContext): Promise<EngineStatus> => {
  const dir = engineDirOf(ctx);
  if (process.env[ENGINE_DIR_ENV]) return { ...(await readEngineStatus(dir)), error: `${ENGINE_DIR_ENV} points at an engine managed outside the app` };
  const onLine = (line: string) => ctx.emit('ap:engine:progress', line);
  try {
    await buildEngine({ buildDir: engineRoot(ctx), onLine });
    return await readEngineStatus(dir);
  } catch (err) {
    ctx.log(`engine setup failed: ${(err as Error).message}`, 'error');
    return { state: 'failed', dir, error: (err as Error).message };
  }
};

export { setUpEngine };
