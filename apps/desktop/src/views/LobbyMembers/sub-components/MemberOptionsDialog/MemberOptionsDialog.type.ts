/* @layer renderer-app @kind types */
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import type { LobbyMembersModel, SlotOptions } from '../../LobbyMembers.type';

type MemberOptionsDialogProps = { serverId: string; lobby: AdminLobby; member: AdminLobbyMember; model: LobbyMembersModel };

type SlotOptionsViewProps = { slot: SlotOptions; titled: boolean };

export type { MemberOptionsDialogProps, SlotOptionsViewProps };
