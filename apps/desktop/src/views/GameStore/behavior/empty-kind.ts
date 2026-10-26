/* @layer renderer-app @kind logic */
import type { EmptyKind, GameTab } from '../GameStore.type';

const emptyKind = (filtered: boolean, loading: boolean, tab: GameTab = 'all'): EmptyKind => {
  if (loading) return 'loading';
  if (filtered) return 'search';
  return tab === 'installed' || tab === 'updates' ? tab : 'none';
};

export { emptyKind };
