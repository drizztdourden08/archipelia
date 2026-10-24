/* @layer core @kind types */
import type { Lobby, LobbyMember, SlotUpload } from '@archipelia/model';

type Participant = { member: LobbyMember; slot: SlotUpload };

type StartedRun = { lobby: Lobby; finished: Promise<Lobby> };

export type { Participant, StartedRun };
