/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { readEngineStatus } from '@archipelia/engine';
import type { EngineStatus } from '@archipelia/model';
import { engineDirOf } from '../engine/engine-dir-of';
import { setUpEngine } from '../engine/set-up-engine';

let building: Promise<EngineStatus> | undefined;

const engineHandlers: HandlerGroup = {
  id: 'archipelia-engine',
  register: (ctx) => {
    ctx.handle('ap:engine:status', async (): Promise<EngineStatus> =>
      (building ? { state: 'building', dir: engineDirOf(ctx) } : readEngineStatus(engineDirOf(ctx))));
    ctx.handle('ap:engine:setup', async () => {
      building ??= setUpEngine(ctx).finally(() => { building = undefined; });
      return building;
    });
  },
};

export { engineHandlers };
