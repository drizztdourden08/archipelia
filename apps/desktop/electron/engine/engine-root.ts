/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { DOMAIN } from '../../src/storage/domains.constants';

const engineRoot = (ctx: MainContext) => ctx.storage.domain(DOMAIN.engine).dir();

export { engineRoot };
