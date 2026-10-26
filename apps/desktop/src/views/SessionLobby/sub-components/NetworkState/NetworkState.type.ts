/* @layer renderer-app @kind types */
import type { LobbyServerStatus } from '../../../../lobbies/lobbies.type';

type NetworkStateProps = {
  open: boolean;
  status: LobbyServerStatus;
  busy: boolean;
  onStop: () => void;
};

export type { NetworkStateProps };
