/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const isFreshSeat = (player: SessionPlayer, fresh: ReadonlySet<string>): boolean => player.kind === 'set' && fresh.has(player.name.toLowerCase());

export { isFreshSeat };
