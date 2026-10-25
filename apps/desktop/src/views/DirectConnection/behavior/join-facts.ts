/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';

const joinFacts = (lobby: AdminLobby, address: string | null): FactsPanelFact[] => [
  { label: 'Session code', value: formatLobbyCode(lobby.code) ?? lobby.code, mono: true, copyable: 'session code' },
  ...(address ? [{ label: 'Server address', value: address, mono: true, copyable: 'server address' }] : []),
  { label: 'Archipelago version', value: lobby.engine.ap, mono: true },
];

export { joinFacts };
