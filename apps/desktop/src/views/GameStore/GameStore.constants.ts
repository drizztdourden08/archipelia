/* @layer renderer-app @kind config */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { GameSource } from '@archipelia/model';
import type { GameCardKind } from '@archipelia/design';
import type { EmptyKind, GameRowState, GameSectionId } from './GameStore.type';

const SOURCE_LABEL: Record<GameSource, string> = { official: 'Built-in', index: 'Archipelago index', file: 'From file', 'first-party': 'Archipelia ready' };

const KIND_LABEL: Record<GameSource, string> = {
  official: 'Built-in world, ships with Archipelago',
  index: 'Archipelago index world, listed by the Archipelago community',
  file: 'World added from a file',
  'first-party': 'Archipelia ready world, listed and checked by Archipelia',
};

const KIND_OF: Record<GameSource, GameCardKind> = { official: 'built-in', index: 'archipelago-index', file: 'file', 'first-party': 'archipelia-ready' };

const SECTION_OF_SOURCE: Record<GameSource, GameSectionId | null> = {
  official: 'built-in',
  'first-party': 'archipelia-ready',
  index: 'archipelago-index',
  file: null,
};

const STATE_LABEL: Record<GameRowState, string> = { installed: 'Installed', update: 'Update available', available: 'Not installed' };

const FIT_LABEL = { fits: 'Fits the engine', none: 'No release yet', blocked: 'Does not fit the engine' } as const;

const NO_RELEASE = 'No release yet';

const SECTIONS: readonly { id: GameSectionId; title: string; icon: IconName }[] = [
  { id: 'installed', title: 'Installed', icon: 'circle-check' },
  { id: 'built-in', title: 'Built-in', icon: 'package' },
  { id: 'archipelia-ready', title: 'Archipelia ready', icon: 'sparkles' },
  { id: 'archipelago-index', title: 'Archipelago index', icon: 'globe' },
  { id: 'updates', title: 'Updates', icon: 'arrow-big-up-dash' },
];

const MIXED_SECTIONS: readonly GameSectionId[] = ['installed', 'built-in', 'archipelia-ready', 'archipelago-index'];

const TILE = { width: 'size-256', height: 'size-64' } as const;

const SEEN_DWELL_MS = 250;

const EMPTY_TEXT: Record<EmptyKind, string> = {
  loading: 'Loading the catalog',
  search: 'No world matches',
  none: 'No world in the catalog yet',
  installed: 'No game installed yet. Add one from the Built-in, Archipelia ready or Archipelago index list.',
  updates: 'Every installed game is up to date',
};

const NONE_INSTALLED = 'No game installed yet. Add one from the lists below.';

const APWORLD = ['apworld'];

const FAILURE = {
  load: 'Could not load the games.',
  install: 'Could not install the game.',
  remove: 'Could not remove the game.',
  file: 'Could not add the game from that file.',
} as const;

export { APWORLD, EMPTY_TEXT, FAILURE, FIT_LABEL, KIND_LABEL, KIND_OF, MIXED_SECTIONS, NONE_INSTALLED, NO_RELEASE, SECTIONS, SECTION_OF_SOURCE, SEEN_DWELL_MS, SOURCE_LABEL, STATE_LABEL, TILE };
