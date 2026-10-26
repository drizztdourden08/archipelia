/* @layer renderer-app @kind logic */
import type { SessionPlayer, SessionTemplate } from '@archipelia/model';
import { checkValues, resolveValues } from '@archipelia/presets';
import { NAME_LIMIT } from '../SessionLobby.constants';
import type { LibraryView, ProblemField, TemplateProblem } from '../SessionLobby.type';

const labelOf = (player: SessionPlayer) => player.name.trim() || `Player ${player.slot}`;

const playerProblem = (player: SessionPlayer, field: ProblemField, message: string): TemplateProblem => ({ slot: player.slot, field, message });

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

const presetProblems = (player: SessionPlayer, { installed, presets }: LibraryView): TemplateProblem[] => {
  if (player.source.kind !== 'preset') return [];
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

const yamlProblems = (player: SessionPlayer, { installed }: LibraryView): TemplateProblem[] => {
  if (player.source.kind !== 'yaml') return [];
  if (!player.source.yaml.trim()) return [playerProblem(player, 'source', `${labelOf(player)}: import a player file`)];
  return installed.some((entry) => entry.game === player.game) ? [] : [playerProblem(player, 'source', `${labelOf(player)}: ${player.game || 'the game'} is not installed`)];
};

const validatePlayers = ({ players }: SessionTemplate, library: LibraryView): TemplateProblem[] => [
  ...nameProblems(players),
  ...players.flatMap((player) => [...presetProblems(player, library), ...yamlProblems(player, library)]),
];

export { validatePlayers };
