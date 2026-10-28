/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { LobbyServerEntry, SessionTemplate } from '@archipelia/model';
import { CONNECTION_TEXT } from './lobbies.constants';
import type { LobbyServerStatus, ServerPlace, SessionReach } from './lobbies.type';
import { entryStatus } from './entry-status';
import { roomFacts } from './room-facts';
import { sessionReach } from './session-reach';

const serverFacts = (reach: SessionReach, place: ServerPlace, entry: LobbyServerEntry | undefined): FactsPanelFact[] => {
  if (reach !== 'archipelia') return [];
  return [
    { label: 'Lobby server', value: place.label },
    ...(place.address ? [{ label: 'Server address', value: place.address, mono: true, copyable: 'server address' }] : []),
    ...(entry ? [{ label: 'Server state', value: entryStatus(entry).text }] : []),
  ];
};

const tabFacts = (
  template: Pick<SessionTemplate, 'host' | 'lan' | 'lobby'>,
  status: LobbyServerStatus | null,
  place: ServerPlace,
  entry: LobbyServerEntry | undefined,
): FactsPanelFact[] => {
  const reach = sessionReach(template);
  return [{ label: 'This session', value: CONNECTION_TEXT[reach] }, ...serverFacts(reach, place, entry), ...roomFacts(template, status)];
};

export { tabFacts };
