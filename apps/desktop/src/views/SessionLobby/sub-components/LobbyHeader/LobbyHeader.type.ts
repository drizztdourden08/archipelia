/* @layer renderer-app @kind types */
import type { LobbyPhase } from '@archipelia/model';
import type { RunAction } from '../../SessionLobby.type';

type LobbyHeaderProps = {
  name: string;
  phase?: LobbyPhase;
  direct: boolean;
  saved: boolean;
  busy: boolean;
  action: RunAction;
  onSave: () => void;
  onEdit: () => void;
  onClose: () => void;
};

export type { LobbyHeaderProps };
