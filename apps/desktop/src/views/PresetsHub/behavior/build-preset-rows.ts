/* @layer renderer-app @kind logic */
import type { GamePreset, InstalledGame } from '@archipelia/model';
import type { PresetRow } from '../PresetsHub.type';
import { changedCount } from './changed-count';
import { editedLabel } from './edited-label';
import { schemaFor } from './schema-for';

const rowOf = (preset: GamePreset, installed: InstalledGame[], now: number): PresetRow => {
  const schema = schemaFor(installed, preset.game);
  const edited = preset.updatedAt ? ` · edited ${editedLabel(preset.updatedAt, now)}` : '';
  return {
    preset,
    meta: `${changedCount(preset, schema)} changed${edited}`,
    group: schema ? preset.game : `${preset.game} · game not installed`,
  };
};

const buildPresetRows = (installed: InstalledGame[], presets: GamePreset[], now: number): PresetRow[] => [...presets]
  .sort((a, b) => a.game.localeCompare(b.game) || a.name.localeCompare(b.name))
  .map((preset) => rowOf(preset, installed, now));

export { buildPresetRows };
