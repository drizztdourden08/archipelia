/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const gameOf = (player: SessionPlayer): string | undefined => (player.kind === 'set' && player.game.length > 0 ? player.game : undefined);

export { gameOf };
