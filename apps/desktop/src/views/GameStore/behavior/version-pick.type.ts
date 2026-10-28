/* @layer renderer-app @kind types */
import type { GameDetailsPicker } from '@archipelia/design';
import type { VersionPick } from '../GameStore.type';

type VersionPickView = { view?: Omit<GameDetailsPicker, 'onChange'>; pick?: VersionPick };

export type { VersionPickView };
