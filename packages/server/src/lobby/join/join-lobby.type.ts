/* @layer core @kind types */
import type { Failure, Hello, WorldEntry } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby, LobbyMember, UploadTrust } from '@archipelia/model';
import type { LobbyLink, Outcome } from '../lobby-service.type';

type TrustRequest = { client: { id: string; name: string }; worlds: WorldEntry[] };

type Assessed = { clientId: string; clientName: string; trust: Outcome<UploadTrust> };

type JoinRequest = { lobby: Lobby; hello: Hello; link: LobbyLink; assessed: Assessed };

type ResumeRequest = JoinRequest & { token: string };

type Welcoming = Omit<JoinRequest, 'assessed'> & { member: LobbyMember; token: string; resumed: boolean; notices: Failure[] };

export type { Assessed, JoinRequest, ResumeRequest, TrustRequest, Welcoming };
