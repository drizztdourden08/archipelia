/* @layer renderer-app @kind logic */
import type { GamePreset, SessionPlayer } from '@archipelia/model';
import { heldOf } from './held-of';
import { withGame } from './with-game';

const withPickedGame = (player: SessionPlayer, game: string, presets: GamePreset[]): SessionPlayer =>
  (game === '' && player.direct ? heldOf(player) : withGame(player, game, presets));

export { withPickedGame };
