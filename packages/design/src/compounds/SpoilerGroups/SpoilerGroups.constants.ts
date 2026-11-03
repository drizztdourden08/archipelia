/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { SpoilerTone } from './SpoilerGroups.type';

const PAGE_SIZE = 200;

const MARK_ICON: Record<SpoilerTone, IconName> = {
  key: 'star',
  useful: 'sparkles',
  trap: 'skull',
  filler: 'circle',
  unknown: 'circle-help',
};

export { MARK_ICON, PAGE_SIZE };
