/* @layer renderer-app @kind types */
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import type { LobbyMembersModel } from '../../LobbyMembers.type';

type MemberDialogActionsProps = { lobby: AdminLobby; member: AdminLobbyMember; model: LobbyMembersModel };

export type { MemberDialogActionsProps };
