/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const gamesOf = (players: readonly SessionPlayer[]): string[] => [...new Set(players.flatMap((player) => (player.game === undefined ? [] : [player.game])))];

export { gamesOf };
