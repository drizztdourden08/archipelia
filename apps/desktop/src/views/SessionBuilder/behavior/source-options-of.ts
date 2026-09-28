/* @layer renderer-app @kind logic */
import type { GamePreset } from '@archipelia/model';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import { presetsFor } from './presets-for';
import { NEW_PRESET_VALUE, PRESET_PREFIX, YAML_VALUE } from '../SessionBuilder.constants';

const sourceOptionsOf = (game: string, presets: GamePreset[]): SelectOption[] => {
  const own = presetsFor(presets, game).map((preset) => ({ value: `${PRESET_PREFIX}${preset.id}`, label: preset.name }));
  const create = game && !own.length ? [{ value: NEW_PRESET_VALUE, label: 'Create a default preset' }] : [];
  return [...own, ...create, { value: YAML_VALUE, label: 'Imported file' }];
};

export { sourceOptionsOf };
