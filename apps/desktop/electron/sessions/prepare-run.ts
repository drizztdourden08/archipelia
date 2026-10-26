/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { LOCAL_SERVER } from '../../src/lobbies/lobbies.constants';
import { lobbyServerOf } from '../../src/lobbies/lobby-server-of';
import { passwordNameOf } from '../../src/lobbies/password-name-of';
import { assertLanConsent } from './assert-lan-consent';
import { onLan } from './on-lan';
import type { RunPreparation } from './sessions.type';

const prepareRun = ({ server, setLanRoom, sharePassword }: RunPreparation) => async (lobbyId: string, template: SessionTemplate): Promise<void> => {
  if (lobbyServerOf(template) !== LOCAL_SERVER) return;
  assertLanConsent(server, template);
  setLanRoom(lobbyId, onLan(template));
  await sharePassword(lobbyId, passwordNameOf(template.id));
};

export { prepareRun };
