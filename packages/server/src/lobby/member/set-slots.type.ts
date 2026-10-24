/* @layer core @kind types */
import type { ClientMeta, Lobby, LobbyMember } from '@archipelia/model';

type Replacing = { lobby: Lobby; member: LobbyMember; client: ClientMeta };

export type { Replacing };
