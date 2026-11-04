/* @layer renderer-app @kind constants */
import type { SegmentOption, SelectOption } from '@drizztdourden08/tessera/primitives';
import type { SpoilerTone, SpoilerView } from '@archipelia/design';
import type { SpoilerItemType } from '@archipelia/sessions/spoiler';
import type { FilterClause } from '@drizztdourden08/tessera/data';
import type { GroupBy, SpoilerTab } from './SpoilerWidget.type';

const SPOILER_SUFFIX = '_Spoiler.txt';

const ITEM_TYPES_SUFFIX = '_ItemTypes.json';

const ITEM_TYPES_FAILED = 'The item types could not be prepared for this spoiler.';

const ITEM_TYPE_LABEL: Record<SpoilerItemType, string> = {
  progression: 'Progression',
  required: 'Required',
  useful: 'Useful',
  trap: 'Trap',
  filler: 'Filler',
  unknown: 'Unknown',
};

const ITEM_TYPE_ORDER: readonly SpoilerItemType[] = ['progression', 'required', 'useful', 'trap', 'filler', 'unknown'];

const ITEM_TONE: Record<SpoilerItemType, SpoilerTone> = {
  progression: 'key',
  required: 'key',
  useful: 'useful',
  trap: 'trap',
  filler: 'filler',
  unknown: 'unknown',
};

const REQUIRED_LABEL = { yes: 'Required', no: 'Not required' } as const;

const WORLD_LABEL = { own: 'Own world', other: 'Other world' } as const;

const NO_SPHERE = 'Not in playthrough';

const UNKNOWN_GAME = 'Unknown game';

const ITEM_ENUM_LIMIT = 400;

const AREA_SPLIT = /^(.+?)(?: - |: )(.+)$/;

const GROUP_OPTIONS: readonly SelectOption[] = [
  { value: 'finder', label: 'Finding slot' },
  { value: 'receiver', label: 'Receiving slot' },
  { value: 'game', label: 'Game' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'type', label: 'Item type' },
  { value: 'none', label: 'No grouping' },
];

const GROUP_ALL: Record<GroupBy, string> = {
  finder: 'Finding slot',
  receiver: 'Receiving slot',
  game: 'Game',
  sphere: 'Sphere',
  type: 'Item type',
  none: 'All placements',
};

const VIEW_OPTIONS: SegmentOption<SpoilerView>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'detailed', label: 'Detailed' },
];

const EMPTY_LABEL: Record<SpoilerTab, string> = {
  placements: 'No placement matches the search and filters.',
  playthrough: 'This spoiler has no playthrough.',
  entrances: 'This spoiler has no entrances.',
  paths: 'This spoiler has no paths.',
  settings: '',
  raw: '',
};

const NONE: readonly string[] = [];

const NO_CLAUSES: readonly FilterClause[] = [];

const NO_OPEN: Record<string, readonly string[]> = {};

const LISTED: readonly SpoilerTab[] = ['placements', 'playthrough', 'entrances', 'paths'];

const ALL_WORLDS = 'All worlds';

const SHARED_AREA = 2;

export {
  ALL_WORLDS, AREA_SPLIT, EMPTY_LABEL, GROUP_ALL, GROUP_OPTIONS, ITEM_ENUM_LIMIT, ITEM_TONE, ITEM_TYPE_LABEL, ITEM_TYPE_ORDER, ITEM_TYPES_FAILED, ITEM_TYPES_SUFFIX,
  LISTED, NO_CLAUSES, NO_OPEN, NO_SPHERE, NONE, REQUIRED_LABEL, SHARED_AREA, SPOILER_SUFFIX, UNKNOWN_GAME, VIEW_OPTIONS, WORLD_LABEL,
};
