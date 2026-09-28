/* @layer renderer-app @kind logic */
import type { GamePreset } from '@archipelia/model';
import { plural } from './plural';

const presetsMeta = (presets: readonly GamePreset[]) => `across ${plural(new Set(presets.map((preset) => preset.game)).size, 'game')}`;

export { presetsMeta };
