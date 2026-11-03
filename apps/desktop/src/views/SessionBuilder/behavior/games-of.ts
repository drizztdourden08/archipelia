/* @layer renderer-app @kind logic */
import { setPlayers } from '@archipelia/model';
import type { SessionPlayer } from '@archipelia/model';

const gamesOf = (players: readonly SessionPlayer[]): string[] => [...new Set(setPlayers(players).map((player) => player.game).filter(Boolean))];

export { gamesOf };
