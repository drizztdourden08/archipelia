/* @layer core @kind types */
import type { Failure } from '@archipelia/lobby-protocol';
import type { Lobby, LobbyMember, SlotState, SlotUpload } from '@archipelia/model';

type WorldVerdict = { failure: Failure; fatal: boolean } | null;

type SlotJob = { lobby: Lobby; member: LobbyMember; slot: SlotUpload };

type SlotVerdict = { memberId: string; slot: string; state: SlotState; failure?: Failure; fatal?: boolean };

export type { SlotJob, SlotVerdict, WorldVerdict };
