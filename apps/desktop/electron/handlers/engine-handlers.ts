/* @layer electron-main @kind logic */
import type { HandlerGroup, MainContext } from '@drizztdourden08/brock-electron/main';
import { buildEngine } from '@archipelia/engine-bundle';
import type { EngineStatus } from '@archipelia/model';
import { ENGINE_DIR_ENV } from '../services/engine-location.constants';
import { engineDirOf } from '../services/engine-dir-of';
import { engineInstalled } from '../services/engine-installed';
import { engineRoot } from '../services/engine-root';
import { loadRuntime } from '../services/load-runtime';

let building: Promise<EngineStatus> | undefined;

const statusOf = async (ctx: MainContext): Promise<EngineStatus> => {
  const dir = engineDirOf(ctx);
  if (building) return { state: 'building', dir };
  if (!(await engineInstalled(ctx))) return { state: 'missing', dir };
  try {
    const runtime = await loadRuntime(ctx);
    return { state: 'ready', dir, apVersion: runtime.apVersion };
  } catch (err) {
    return { state: 'failed', dir, error: (err as Error).message };
  }
};

const setUp = async (ctx: MainContext): Promise<EngineStatus> => {
  if (process.env[ENGINE_DIR_ENV]) return { ...(await statusOf(ctx)), error: `${ENGINE_DIR_ENV} points at an engine managed outside the app` };
  const onLine = (line: string) => ctx.emit('ap:engine:progress', line);
  try {
    await buildEngine({ buildDir: engineRoot(ctx), onLine });
    return await statusOf(ctx);
  } catch (err) {
    ctx.log(`engine setup failed: ${(err as Error).message}`, 'error');
    return { state: 'failed', dir: engineDirOf(ctx), error: (err as Error).message };
  }
};

const engineHandlers: HandlerGroup = {
  id: 'archipelia-engine',
  register: (ctx) => {
    ctx.handle('ap:engine:status', () => statusOf(ctx));
    ctx.handle('ap:engine:setup', async () => {
      building ??= setUp(ctx).finally(() => { building = undefined; });
      return building;
    });
  },
};

export { engineHandlers };
