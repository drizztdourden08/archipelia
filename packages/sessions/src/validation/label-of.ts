/* @layer core @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const labelOf = (player: SessionPlayer) => player.name.trim() || `Player ${player.slot}`;

export { labelOf };
