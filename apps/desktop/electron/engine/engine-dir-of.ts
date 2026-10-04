/* @layer electron-main @kind logic */
import { engineDirIn } from '@archipelia/engine';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { engineRoot } from './engine-root';

const engineDirOf = (ctx: MainContext) => engineDirIn(engineRoot(ctx));

export { engineDirOf };
