/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';

const engineRoot = (ctx: MainContext) => ctx.paths.data('engine');

export { engineRoot };
