/* @layer renderer-app @kind logic */
import type { GamePreset } from '@archipelia/model';

const presetsFor = (presets: GamePreset[], game: string) =>
  presets.filter((preset) => preset.game === game).sort((a, b) => a.name.localeCompare(b.name));

export { presetsFor };
