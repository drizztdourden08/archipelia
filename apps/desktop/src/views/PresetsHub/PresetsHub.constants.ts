/* @layer renderer-app @kind config */
import type { ItemListProps } from '@drizztdourden08/tessera/composites';
import type { PresetRow } from './PresetsHub.type';

const RECENT_DAYS = 7;

const DAY_MS = 86_400_000;

const DEFAULTS = '';

const NO_GAME = 'No game is installed yet, so there is nothing to make a preset for.';

const GAME_GROUP = { empty: 'No preset for this game yet.', action: 'New preset' } as const;

const PRESET_ROWS = {
  getId: (row: PresetRow) => row.preset.id,
  getName: (row: PresetRow) => row.preset.name,
  render: (row: PresetRow) => ({ meta: row.meta }),
  groupBy: (row: PresetRow) => row.group,
} satisfies Pick<ItemListProps<PresetRow>, 'getId' | 'getName' | 'render' | 'groupBy'>;

const FAILURE = {
  load: 'Could not load your presets.',
  duplicate: 'Could not duplicate the preset.',
  remove: 'Could not delete the preset.',
} as const;

export { DAY_MS, DEFAULTS, FAILURE, GAME_GROUP, NO_GAME, PRESET_ROWS, RECENT_DAYS };
