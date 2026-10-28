/* @layer renderer-app @kind types */
import type { AdminLobby, RunOverride } from '@archipelia/model';
import type { RunAction } from '../../SessionLobby.type';

type LobbyHeaderProps = {
  name: string;
  lobby?: AdminLobby;
  serverId: string;
  direct: boolean;
  changes: readonly RunOverride[];
  busy: boolean;
  action: RunAction;
  onEdit: () => void;
  onClose: () => void;
};

export type { LobbyHeaderProps };
