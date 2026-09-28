/* @layer renderer-app @kind logic */
import type { GamePreset, GameSchema } from '@archipelia/model';
import { changedValues } from '@archipelia/presets';

const changedCount = (preset: GamePreset, schema: GameSchema | undefined) =>
  Object.keys(schema ? changedValues(schema, preset.values) : preset.values).length;

export { changedCount };
