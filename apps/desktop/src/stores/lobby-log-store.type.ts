/* @layer renderer-app @kind types */
import type { HostLogLine } from '@archipelia/hosts';
import type { AdminLobby } from '@archipelia/model';

type LobbyLogState = {
  seen: Record<string, AdminLobby>;
  lines: Record<string, readonly HostLogLine[]>;
  record: (lobby: AdminLobby, at: number) => void;
};

export type { LobbyLogState };
