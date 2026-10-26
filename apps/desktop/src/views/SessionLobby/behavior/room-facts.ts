/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { SessionTemplate } from '@archipelia/model';
import { LOOPBACK } from '../../../lobbies/lobbies.constants';
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import { sessionReach } from '../../../lobbies/session-reach';
import { CONNECTION_TEXT } from './lobby-view.constants';

const roomFacts = (template: SessionTemplate, status: LobbyServerStatus | null): FactsPanelFact[] => {
  const { host } = template;
  if (!status || host.kind !== 'local' || sessionReach(template) !== 'lan') return [];
  return [
    { label: CONNECTION_TEXT.roomLan, value: `${status.lanAddress}:${host.port}`, mono: true, copyable: 'room address on your network' },
    { label: CONNECTION_TEXT.roomHere, value: `${LOOPBACK}:${host.port}`, mono: true, copyable: 'room address on this computer' },
  ];
};

export { roomFacts };
