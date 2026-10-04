/* @layer electron-main @kind config */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { dataHandlers } from './data-handlers';
import { engineHandlers } from './engine-handlers';
import { gamesHandlers } from './games-handlers';
import { ggHandlers } from './gg-handlers';
import { libraryHandlers } from './library-handlers';
import { serverHandlers } from './server-handlers';
import { sessionHandlers } from './session-handlers';

const handlers: HandlerGroup[] = [dataHandlers, engineHandlers, gamesHandlers, ggHandlers, libraryHandlers, serverHandlers, sessionHandlers];

export { handlers };
