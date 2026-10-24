/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { AdminLobby } from '@archipelia/model';
import { DATE_FORMAT } from '../LobbyDetail.constants';
import { roomText } from './room-text';
import { usedSlotCount } from './used-slot-count';

const lobbyFacts = (lobby: AdminLobby, serverLabel: string, machineLabel?: string): FactsPanelFact[] => [
  { label: 'Server', value: serverLabel },
  { label: 'Archipelago version', value: lobby.engine.ap, mono: true },
  { label: 'Host approval', value: lobby.options.admission === 'host-approval' ? 'On' : 'Off' },
  { label: 'Allow unlisted clients', value: lobby.options.allowUnlisted ? 'On' : 'Off' },
  { label: 'Room host', value: roomText(lobby.options.room, machineLabel) },
  { label: 'Slots', value: `${usedSlotCount(lobby)} of ${lobby.options.maxSlots}` },
  { label: lobby.phase === 'closed' ? 'Closed' : 'Closes if unused', value: DATE_FORMAT.format(lobby.closesAt) },
];

export { lobbyFacts };
