/* @layer renderer-app @kind logic */
import type { GamePreset, SessionPlayer } from '@archipelia/model';
import { heldOf } from './held-of';
import { withGame } from './with-game';

const withPickedGame = (player: SessionPlayer, game: string, presets: GamePreset[], name: string): SessionPlayer =>
  (game === '' ? heldOf(player) : withGame(player, game, presets, name));

export { withPickedGame };
