/* @layer renderer-app @kind types */
import type { LobbyServerStatus } from '../lobbies/lobbies.type';

type ServerStatusState = {
  status: LobbyServerStatus | null;
  setStatus: (status: LobbyServerStatus) => void;
  reload: () => Promise<void>;
};

export type { ServerStatusState };
