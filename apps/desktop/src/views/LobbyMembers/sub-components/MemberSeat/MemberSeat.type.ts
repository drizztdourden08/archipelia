/* @layer renderer-app @kind types */
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import type { LobbyMembersModel, SeatLead } from '../../LobbyMembers.type';

type MemberSeatProps = { lobby: AdminLobby; member: AdminLobbyMember; model: LobbyMembersModel; lead?: SeatLead };

export type { MemberSeatProps };
