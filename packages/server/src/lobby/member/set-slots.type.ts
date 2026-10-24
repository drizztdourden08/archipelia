/* @layer core @kind types */
import type { ClientMeta, Lobby, LobbyMember } from '@archipelia/model';
import type { Assessed } from '../join/join-lobby.type';

type Replacing = { lobby: Lobby; member: LobbyMember; client: ClientMeta; early: Assessed | undefined };

export type { Replacing };
