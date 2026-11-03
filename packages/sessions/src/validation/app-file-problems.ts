/* @layer core @kind logic */
import type { SetPlayer } from '@archipelia/model';
import { appGameOf } from './app-game-of';
import { hasPreRolled } from './has-pre-rolled';
import { labelOf } from './label-of';
import { playerProblem } from './player-problem';
import type { LibraryView, TemplateProblem } from './validate-players.type';

const appFileProblems = (player: SetPlayer, library: LibraryView): TemplateProblem[] => {
  const game = appGameOf(player, library);
  if (!game) return [];
  const name = labelOf(player);
  const { source } = player;
  if (source.kind !== 'yaml') return [playerProblem(player, 'source', `${name}: ${game.game} player files come from its own app. Import the YAML it saved, or make the slot Direct.`)];
  if (!source.yaml.trim() || hasPreRolled(source.yaml, game.game)) return [];
  return [playerProblem(player, 'source', `${name}: this ${game.game} YAML was not saved by its app (no pre_rolled). Save the Archipelago files from the app again.`)];
};

export { appFileProblems };
