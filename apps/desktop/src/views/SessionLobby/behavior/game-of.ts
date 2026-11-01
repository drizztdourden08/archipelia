/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const gameOf = ({ game }: SessionPlayer): string | undefined => (game === undefined || game.length === 0 ? undefined : game);

export { gameOf };
