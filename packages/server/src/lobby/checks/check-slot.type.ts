/* @layer core @kind types */
import type { Failure } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby, LobbyMember, SlotState, SlotUpload } from '@archipelia/model';

type WorldVerdict = { failure: Failure; fatal: boolean } | null;

type SlotJob = { lobby: Lobby; member: LobbyMember; slot: SlotUpload };

type SlotVerdict = {
  memberId: string;
  slot: string;
  from: SlotState;
  yamlSha256: string;
  worldSha256?: string;
  state: SlotState;
  failure?: Failure;
  fatal?: boolean;
};

export type { SlotJob, SlotVerdict, WorldVerdict };
