/* @layer protocol @kind logic */
import type { LobbyPhase } from '../protocol/protocol.type';

const lobbyJoinable = (phase: LobbyPhase, full: boolean): boolean => phase === 'open' && !full;

export { lobbyJoinable };
