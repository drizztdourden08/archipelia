/* @layer core @kind types */
import type { LobbyLink } from '../lobby-service.type';
import type { createLobbyHub } from './create-lobby-hub';

type HubEntry = { link: LobbyLink; seen?: string };

type LobbyHub = ReturnType<typeof createLobbyHub>;

export type { HubEntry, LobbyHub };
