/* @layer renderer-app @kind types */
import type { LobbyServerEntry } from '@archipelia/model';
import type { LobbyServerStatus, ServerPlace } from '../../lobbies/lobbies.type';

type HostWhere = 'private' | 'lan' | 'remote';

type NetworkStateProps = {
  open: boolean;
  status: LobbyServerStatus;
  busy: boolean;
  onStop: () => void;
};

type NetworkNoticesProps = { open: boolean; status: LobbyServerStatus };

type RemoteChoiceProps = {
  serverId: string;
  entries: readonly LobbyServerEntry[];
  place: ServerPlace;
  stillOpen: boolean;
  busy: boolean;
  onSelect: (serverId: string) => void;
  onStop: () => void;
  onManage: () => void;
};

export type { HostWhere, NetworkNoticesProps, NetworkStateProps, RemoteChoiceProps };
