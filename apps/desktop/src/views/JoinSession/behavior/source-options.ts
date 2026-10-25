/* @layer renderer-app @kind logic */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { GamePreset } from '@archipelia/model';
import { DEFAULTS_VALUE, TEXT, YAML_VALUE } from '../JoinSession.constants';

const sourceOptions = (presets: readonly GamePreset[], game: string): SelectOption[] => [
  { value: DEFAULTS_VALUE, label: TEXT.defaults },
  ...presets.filter((preset) => preset.game === game).map((preset) => ({ value: preset.id, label: preset.name })),
  { value: YAML_VALUE, label: TEXT.importFile },
];

export { sourceOptions };
