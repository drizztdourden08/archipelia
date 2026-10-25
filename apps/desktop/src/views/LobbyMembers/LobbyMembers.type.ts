/* @layer renderer-app @kind types */
import type { AdminLobby, AdminLobbyMember, AdminWorld, SlotUpload } from '@archipelia/model';
import type { useLobbyMembers } from './behavior/useLobbyMembers';

type LobbyMembersProps = { serverId: string; lobbyId: string };

type MemberActions = { approve: boolean; refuse: boolean; remove: boolean };

type TrustTag = { text: string; color: 'success' | 'warning'; title: string };

type ConsentRequest = { lobby: AdminLobby; member: AdminLobbyMember; slot: SlotUpload; world: AdminWorld };

type LobbyMembersModel = ReturnType<typeof useLobbyMembers>;

export type { ConsentRequest, LobbyMembersModel, LobbyMembersProps, MemberActions, TrustTag };
