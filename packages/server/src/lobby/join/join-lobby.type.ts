/* @layer core @kind types */
import type { Failure, Hello, WorldEntry } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby, LobbyMember } from '@archipelia/model';
import type { LobbyLink } from '../lobby-service.type';

type JoinRequest = { lobby: Lobby; hello: Hello; link: LobbyLink };

type ResumeRequest = JoinRequest & { token: string };

type TrustRequest = { client: { id: string; name: string }; worlds: WorldEntry[] };

type Welcoming = JoinRequest & { member: LobbyMember; token: string; resumed: boolean; notices: Failure[] };

export type { JoinRequest, ResumeRequest, TrustRequest, Welcoming };
