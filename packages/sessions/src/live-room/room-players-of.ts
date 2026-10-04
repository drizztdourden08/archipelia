/* @layer core @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import type { RoomPlayer } from './live-room.type';

const roomPlayersOf = (players: readonly SessionPlayer[]): RoomPlayer[] =>
  [...players].sort((a, b) => a.slot - b.slot).map((p) => ({ team: 0, slot: p.slot, name: p.name, game: p.game }));

export { roomPlayersOf };
