/* @layer renderer-app @kind logic */
import type { ItemListGroup } from '@drizztdourden08/tessera/composites';
import type { PresetGroupEntry, PresetRow } from '../PresetsHub.type';
import { GAME_GROUP } from '../PresetsHub.constants';

const gameGroup = (game: string, onNew: (game: string) => void): PresetGroupEntry =>
  ({ game, group: { name: game, empty: GAME_GROUP.empty, action: { label: GAME_GROUP.action, onSelect: () => onNew(game) } } });

const buildPresetGroups = (games: readonly string[], rows: readonly PresetRow[], onNew: (game: string) => void): ItemListGroup[] => {
  const entries = new Map(games.map((game) => [game, gameGroup(game, onNew)]));
  rows.forEach((row) => {
    if (!entries.has(row.group)) entries.set(row.group, { game: row.preset.game, group: { name: row.group } });
  });
  return [...entries.values()]
    .sort((a, b) => a.game.localeCompare(b.game) || a.group.name.localeCompare(b.group.name))
    .map((entry) => entry.group);
};

export { buildPresetGroups };
