/* @layer renderer-app @kind types */
import type { AdminLobby, AdminLobbyMember, AdminWorld, SlotUpload } from '@archipelia/model';
import type { useLobbyDetail } from './behavior/useLobbyDetail';

type LobbyDetailProps = { serverId: string; lobbyId: string };

type LobbyActions = { lock: boolean; start: boolean; startBlock: string | null; close: boolean; stopRoom: boolean };

type MemberActions = { approve: boolean; refuse: boolean; remove: boolean };

type TrustTag = { text: string; color: 'success' | 'warning'; title: string };

type ConsentRequest = { lobby: AdminLobby; member: AdminLobbyMember; slot: SlotUpload; world: AdminWorld };

type LobbyDetailModel = ReturnType<typeof useLobbyDetail>;

export type { ConsentRequest, LobbyActions, LobbyDetailModel, LobbyDetailProps, MemberActions, TrustTag };
