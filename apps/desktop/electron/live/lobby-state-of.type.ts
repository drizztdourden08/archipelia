/* @layer electron-main @kind types */
import type { AdminLobby } from '@archipelia/model';

type FoundLobby = { state: 'alive'; lobby: AdminLobby } | { state: 'gone' } | { state: 'unknown' };

export type { FoundLobby };
