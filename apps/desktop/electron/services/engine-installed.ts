/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { RUNTIME_FILE } from '@archipelia/engine';
import { engineDirOf } from './engine-dir-of';

const engineInstalled = (ctx: MainContext) =>
  access(join(engineDirOf(ctx), RUNTIME_FILE)).then(() => true, () => false);

export { engineInstalled };
