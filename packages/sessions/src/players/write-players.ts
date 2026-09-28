/* @layer core @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { checkValues, resolveValues } from '@archipelia/presets';
import type { PlayerDeps } from './write-players.type';
import { renderImportedYaml } from './render-imported-yaml';
import { renderPresetYaml } from './render-preset-yaml';
import { playerFileName } from './player-file-name';

const renderPlayer = async (player: SessionPlayer, { presets, schemaOf }: PlayerDeps) => {
  if (player.source.kind === 'yaml') return renderImportedYaml(player, player.source.yaml);
  const schema = await schemaOf(player.game);
  if (!schema) throw new Error(`${player.name}: ${player.game} is not installed`);
  const preset = await presets.get(player.source.presetId);
  if (!preset) throw new Error(`${player.name}: preset ${player.source.presetId} is missing`);
  const values = resolveValues(schema, preset.values, player.source.overrides);
  const problems = checkValues(schema, values);
  if (problems.length) throw new Error(`${player.name}: ${problems.map((p) => `${p.key} must be ${p.expected}`).join('; ')}`);
  return renderPresetYaml(player, values);
};

const writePlayers = async (players: SessionPlayer[], playersDir: string, deps: PlayerDeps) => {
  const names = new Set<string>();
  for (const player of players) {
    if (names.has(player.name)) throw new Error(`two players are named ${player.name}`);
    names.add(player.name);
    await deps.files.writeText(`${playersDir}/${playerFileName(player)}`, await renderPlayer(player, deps));
  }
};

export { writePlayers };
