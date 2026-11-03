/* @layer core @kind logic */
import type { SetPlayer } from '@archipelia/model';

const labelOf = (player: SetPlayer) => player.name.trim() || `Player ${player.slot}`;

export { labelOf };
