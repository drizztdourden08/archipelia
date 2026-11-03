/* @layer renderer-app @kind logic */
import { PRE_ROLLED_KEY, isRecord } from '@archipelia/model';
import type { GamePreset, InstalledGame, OptionValue, SessionPlayer } from '@archipelia/model';
import { parseAllDocuments } from 'yaml';

const valuesOf = (yaml: string, game: InstalledGame): Record<string, OptionValue> => {
  const parsed: unknown = parseAllDocuments(yaml)[0]?.toJS();
  const block = isRecord(parsed) ? parsed[game.game] : undefined;
  if (!isRecord(block)) return {};
  return Object.fromEntries(
    game.schema.options.filter((def) => def.key !== PRE_ROLLED_KEY && def.key in block).map((def) => [def.key, block[def.key] as OptionValue]),
  );
};

const yamlPresetOf = (player: SessionPlayer, game: InstalledGame): GamePreset | undefined => {
  if (player.source?.kind !== 'yaml' || !player.source.yaml.trim()) return undefined;
  return { id: '', game: game.game, name: player.source.fileName, values: valuesOf(player.source.yaml, game), updatedAt: 0 };
};

export { yamlPresetOf };
