/* @layer core @kind logic */
import { hostedPlayers } from '@archipelia/model';
import type { HostedPlayer, SessionPlayer, SessionTemplate } from '@archipelia/model';
import { checkValues, resolveValues } from '@archipelia/presets';
import { appFileProblems } from './app-file-problems';
import { appGameOf } from './app-game-of';
import { labelOf } from './label-of';
import { playerProblem } from './player-problem';
import { NAME_LIMIT } from './validation.constants';
import type { LibraryView, TemplateProblem } from './validate-players.type';

const nameProblems = (players: SessionPlayer[]): TemplateProblem[] => {
  const seen = new Set<string>();
  return players.flatMap((player) => {
    const name = player.name.trim();
    if (!name) return [playerProblem(player, 'name', `Player ${player.slot} needs a name`)];
    if (name.length > NAME_LIMIT) return [playerProblem(player, 'name', `${name}: a name holds at most ${NAME_LIMIT} characters`)];
    const key = name.toLowerCase();
    if (seen.has(key)) return [playerProblem(player, 'name', `Two players are named ${name}`)];
    seen.add(key);
    return [];
  });
};

const presetProblems = (player: HostedPlayer, library: LibraryView): TemplateProblem[] => {
  const { installed, presets } = library;
  if (player.source.kind !== 'preset' || appGameOf(player, library)) return [];
  const game = installed.find((entry) => entry.game === player.game);
  if (!game) return [playerProblem(player, 'game', player.game ? `${labelOf(player)}: ${player.game} is not installed` : `${labelOf(player)}: pick a game`)];
  const { presetId, overrides } = player.source;
  const preset = presets.find((entry) => entry.id === presetId);
  if (preset?.game !== player.game) return [playerProblem(player, 'source', `${labelOf(player)}: pick a preset`)];
  const values = resolveValues(game.schema, preset.values, overrides);
  return checkValues(game.schema, values).map((problem) => {
    const optionLabel = game.schema.options.find((def) => def.key === problem.key)?.displayName ?? problem.key;
    return { ...playerProblem(player, 'option', `${labelOf(player)}: ${optionLabel} must be ${problem.expected}`), optionKey: problem.key, optionLabel };
  });
};

const yamlProblems = (player: HostedPlayer, { installed }: LibraryView): TemplateProblem[] => {
  if (player.source.kind !== 'yaml') return [];
  if (!player.source.yaml.trim()) return [playerProblem(player, 'source', `${labelOf(player)}: import a player file`)];
  return installed.some((entry) => entry.game === player.game) ? [] : [playerProblem(player, 'source', `${labelOf(player)}: ${player.game || 'the game'} is not installed`)];
};

const validatePlayers = ({ players }: SessionTemplate, library: LibraryView): TemplateProblem[] => [
  ...nameProblems(players),
  ...hostedPlayers(players).flatMap((player) => [...appFileProblems(player, library), ...presetProblems(player, library), ...yamlProblems(player, library)]),
];

export { validatePlayers };
