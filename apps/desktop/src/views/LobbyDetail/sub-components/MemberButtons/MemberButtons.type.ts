/* @layer renderer-app @kind types */
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import type { LobbyDetailModel } from '../../LobbyDetail.type';

type MemberButtonsProps = { lobby: AdminLobby; member: AdminLobbyMember; model: LobbyDetailModel };

export type { MemberButtonsProps };
