/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { LOCAL_SERVER } from '../../src/lobbies/lobbies.constants';
import { lobbyServerOf } from '../../src/lobbies/lobby-server-of';

const onLan = (template: SessionTemplate): boolean => template.lan === true && lobbyServerOf(template) === LOCAL_SERVER;

export { onLan };
