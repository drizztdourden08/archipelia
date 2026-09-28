/* @layer renderer-app @kind logic */
import type { GamePreset, GameSchema, InstalledGame } from '@archipelia/model';
import type { PresetGroup, PresetRow } from '../PresetsHub.type';
import { changedCount } from './changed-count';
import { editedLabel } from './edited-label';
import { schemaFor } from './schema-for';

const rowOf = (preset: GamePreset, schema: GameSchema | undefined, now: number): PresetRow => {
  const changed = changedCount(preset, schema);
  const edited = preset.updatedAt ? ` · edited ${editedLabel(preset.updatedAt, now)}` : '';
  return { preset, changed, meta: `${changed} changed${edited}` };
};

const buildPresetGroups = (installed: InstalledGame[], presets: GamePreset[], now: number): PresetGroup[] => {
  const games = [...new Set([...installed.map((entry) => entry.game), ...presets.map((preset) => preset.game)])]
    .sort((a, b) => a.localeCompare(b));
  return games.map((game) => {
    const schema = schemaFor(installed, game);
    const rows = presets
      .filter((preset) => preset.game === game)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((preset) => rowOf(preset, schema, now));
    return { game, schema, rows };
  });
};

export { buildPresetGroups };
