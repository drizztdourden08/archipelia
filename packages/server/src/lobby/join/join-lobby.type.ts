/* @layer core @kind types */
import type { Hello, WorldEntry } from '@archipelia/lobby-protocol';
import type { Lobby } from '@archipelia/model';
import type { LobbyLink } from '../lobby-service.type';

type JoinRequest = { lobby: Lobby; hello: Hello; link: LobbyLink };

type ResumeRequest = JoinRequest & { token: string };

type TrustRequest = { client: { id: string; name: string }; worlds: WorldEntry[] };

export type { JoinRequest, ResumeRequest, TrustRequest };
