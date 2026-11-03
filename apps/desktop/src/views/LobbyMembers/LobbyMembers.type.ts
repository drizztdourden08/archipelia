/* @layer renderer-app @kind types */
import type { AdminLobby, AdminLobbyMember, AdminWorld, SlotUpload } from '@archipelia/model';
import type { useLobbyMembers } from './behavior/useLobbyMembers';

type LobbyMembersProps = { serverId: string; lobbyId: string };

type MemberActions = { approve: boolean; refuse: boolean; remove: boolean };

type TrustTag = { text: string; color: 'success' | 'warning'; title: string };

type ConsentRequest = { lobby: AdminLobby; member: AdminLobbyMember; slot: SlotUpload; world: AdminWorld };

type LobbyMembersModel = ReturnType<typeof useLobbyMembers>;

type OptionRow = { key: string; label: string; value: string };

type OptionGroup = { name: string; rows: OptionRow[] };

type OptionsOfYaml = { groups: OptionGroup[]; problem?: string };

type SlotOptions = OptionsOfYaml & { name: string; game: string; yaml: string | null; known: boolean };

type MemberOptionsTarget = { serverId: string; lobbyId: string; memberId: string; rev: number };

type MemberOptionsState =
  | { status: 'loading' }
  | { status: 'failed'; problem: string }
  | { status: 'ready'; slots: SlotOptions[] };

export type {
  ConsentRequest, LobbyMembersModel, LobbyMembersProps, MemberActions, MemberOptionsState, MemberOptionsTarget, OptionGroup, OptionsOfYaml, SlotOptions, TrustTag,
};
