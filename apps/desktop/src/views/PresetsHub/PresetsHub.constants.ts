/* @layer renderer-app @kind config */
import type { ManagedListProps } from '@drizztdourden08/tessera/composites';
import type { PresetRow } from './PresetsHub.type';

const RECENT_DAYS = 7;

const DAY_MS = 86_400_000;

const DEFAULTS = '';

const NO_GAME = 'No game is installed yet, so there is nothing to make a preset for.';

const NO_PRESET = 'No preset yet. Press New preset to make one.';

const PRESET_ROWS = {
  getId: (row: PresetRow) => row.preset.id,
  getName: (row: PresetRow) => row.preset.name,
  render: (row: PresetRow) => ({ meta: row.meta }),
  groupBy: (row: PresetRow) => row.group,
} satisfies Pick<ManagedListProps<PresetRow>, 'getId' | 'getName' | 'render' | 'groupBy'>;

const FAILURE = {
  load: 'Could not load your presets.',
  duplicate: 'Could not duplicate the preset.',
  remove: 'Could not delete the preset.',
} as const;

export { DAY_MS, DEFAULTS, FAILURE, NO_GAME, NO_PRESET, PRESET_ROWS, RECENT_DAYS };
