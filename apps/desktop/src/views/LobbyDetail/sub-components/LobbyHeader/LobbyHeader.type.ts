/* @layer renderer-app @kind types */
import type { AdminLobby } from '@archipelia/model';
import type { LobbyDetailModel } from '../../LobbyDetail.type';

type LobbyHeaderProps = { lobby: AdminLobby; model: LobbyDetailModel };

export type { LobbyHeaderProps };
