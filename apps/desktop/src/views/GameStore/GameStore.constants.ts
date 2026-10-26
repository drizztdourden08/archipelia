/* @layer renderer-app @kind config */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { GameSource } from '@archipelia/model';
import type { GameCardKind } from '@archipelia/design';
import type { EmptyKind, GameRowState, GameSectionId } from './GameStore.type';

const SOURCE_LABEL: Record<GameSource, string> = { official: 'Official', index: 'Community', file: 'From file', 'first-party': 'First-party' };

const KIND_LABEL: Record<GameSource, string> = {
  official: 'Official world, ships with Archipelago',
  index: 'Community world',
  file: 'World added from a file',
  'first-party': 'First-party world, made for Archipelia',
};

const KIND_OF: Record<GameSource, GameCardKind> = { official: 'official', index: 'community', file: 'file', 'first-party': 'first-party' };

const STATE_LABEL: Record<GameRowState, string> = { installed: 'Installed', update: 'Update available', available: 'Not installed' };

const FIT_LABEL = { fits: 'Fits the engine', none: 'No release yet', blocked: 'Does not fit the engine' } as const;

const NO_RELEASE = 'No release yet';

const SECTIONS: readonly { id: GameSectionId; title: string; icon: IconName }[] = [
  { id: 'installed', title: 'Installed', icon: 'circle-check' },
  { id: 'official', title: 'Official', icon: 'package' },
  { id: 'community', title: 'Community', icon: 'users' },
  { id: 'updates', title: 'Updates', icon: 'arrow-big-up-dash' },
];

const MIXED_SECTIONS: readonly GameSectionId[] = ['installed', 'official', 'community'];

const TILE = { width: 'size-256', height: 'size-64' } as const;

const SEEN_DWELL_MS = 250;

const EMPTY_TEXT: Record<EmptyKind, string> = {
  loading: 'Loading the catalog',
  search: 'No world matches',
  none: 'No world in the catalog yet',
  installed: 'No game installed yet. Add one from the Official or Community list.',
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

export { APWORLD, EMPTY_TEXT, FAILURE, FIT_LABEL, KIND_LABEL, KIND_OF, MIXED_SECTIONS, NONE_INSTALLED, NO_RELEASE, SECTIONS, SEEN_DWELL_MS, SOURCE_LABEL, STATE_LABEL, TILE };
