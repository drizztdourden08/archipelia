/* @layer renderer-app @kind logic */
import { lobbyAddress } from '../../../lobbies/lobby-address';
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import { MODE_OPTIONS } from '../ArchipeliaServers.constants';

const reachSummary = (status: LobbyServerStatus): string | null => {
  const address = lobbyAddress(status);
  if (status.state !== 'listening' || address === null) return null;
  const mode = MODE_OPTIONS.find((option) => option.value === status.options.mode)?.label ?? status.options.mode;
  return `Lobby address ${address}. Network mode ${mode}.`;
};

export { reachSummary };
