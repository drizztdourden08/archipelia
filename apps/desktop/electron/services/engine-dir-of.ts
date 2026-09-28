/* @layer electron-main @kind logic */
import { ENGINE_AP_VERSION } from '@archipelia/engine';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { join } from 'node:path';
import { ENGINE_DIR_ENV } from './engine-location.constants';
import { engineRoot } from './engine-root';

const engineTarget = () => `${ENGINE_AP_VERSION}-${process.platform}-${process.arch}`;

const engineDirOf = (ctx: MainContext) => process.env[ENGINE_DIR_ENV] ?? join(engineRoot(ctx), engineTarget());

export { engineDirOf };
