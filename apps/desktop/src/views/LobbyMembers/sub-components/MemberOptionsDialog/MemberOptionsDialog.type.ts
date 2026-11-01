/* @layer renderer-app @kind types */
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import type { SlotOptions } from '../../LobbyMembers.type';

type MemberOptionsDialogProps = { serverId: string; lobby: AdminLobby; member: AdminLobbyMember; onClose: () => void };

type SlotOptionsViewProps = { slot: SlotOptions; titled: boolean };

export type { MemberOptionsDialogProps, SlotOptionsViewProps };
