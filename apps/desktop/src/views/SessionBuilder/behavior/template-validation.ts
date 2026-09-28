/* @layer renderer-app @kind logic */
import type { HostTarget, SessionPlayer, SessionTemplate } from '@archipelia/model';
import { checkValues, resolveValues } from '@archipelia/presets';
import { NAME_LIMIT } from '../SessionBuilder.constants';
import type { LibraryView } from '../SessionBuilder.type';

const labelOf = (player: SessionPlayer) => player.name.trim() || `Player ${player.slot}`;

const nameProblems = (players: SessionPlayer[]) => {
  const seen = new Set<string>();
  return players.flatMap((player) => {
    const name = player.name.trim();
    if (!name) return [`Player ${player.slot} needs a name`];
    if (name.length > NAME_LIMIT) return [`${name}: a name holds at most ${NAME_LIMIT} characters`];
    const key = name.toLowerCase();
    if (seen.has(key)) return [`Two players are named ${name}`];
    seen.add(key);
    return [];
  });
};

const presetProblems = (player: SessionPlayer, { installed, presets }: LibraryView) => {
  if (player.source.kind !== 'preset') return [];
  const game = installed.find((entry) => entry.game === player.game);
  if (!game) return [player.game ? `${labelOf(player)}: ${player.game} is not installed` : `${labelOf(player)}: pick a game`];
  const { presetId, overrides } = player.source;
  const preset = presets.find((entry) => entry.id === presetId);
  if (preset?.game !== player.game) return [`${labelOf(player)}: pick a preset`];
  const values = resolveValues(game.schema, preset.values, overrides);
  return checkValues(game.schema, values).map((problem) => `${labelOf(player)}: ${problem.key} must be ${problem.expected}`);
};

const yamlProblems = (player: SessionPlayer, { installed }: LibraryView) => {
  if (player.source.kind !== 'yaml') return [];
  if (!player.source.yaml.trim()) return [`${labelOf(player)}: import a player file`];
  return installed.some((entry) => entry.game === player.game) ? [] : [`${labelOf(player)}: ${player.game || 'the game'} is not installed`];
};

const hostProblems = (host: HostTarget) => {
  if (host.kind === 'local' && !(Number.isInteger(host.port) && host.port > 0 && host.port < 65536)) return ['The port must be between 1 and 65535'];
  if (host.kind === 'remote' && !host.serverId) return ['Pick a server to host on'];
  return [];
};

const validateTemplate = (template: SessionTemplate, library: LibraryView): string[] => [
  ...(template.name.trim() ? [] : ['The session needs a name']),
  ...(template.players.length ? [] : ['Add at least one player']),
  ...nameProblems(template.players),
  ...template.players.flatMap((player) => [...presetProblems(player, library), ...yamlProblems(player, library)]),
  ...hostProblems(template.host),
];

export { validateTemplate };
