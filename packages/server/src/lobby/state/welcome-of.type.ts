/* @layer core @kind types */
import type { Lobby, LobbyMember } from '@archipelia/model';

type WelcomeInput = { lobby: Lobby; member: LobbyMember; token: string; need: string[]; re?: number; resumed: boolean; serverVersion: string };

export type { WelcomeInput };
