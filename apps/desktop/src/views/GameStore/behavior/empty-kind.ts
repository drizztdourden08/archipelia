/* @layer renderer-app @kind logic */
import type { EmptyKind, GameTab } from '../GameStore.type';

const emptyKind = (tab: GameTab, query: string, loading: boolean): EmptyKind => {
  if (loading) return 'loading';
  if (query.trim()) return 'search';
  if (tab === 'updates' || tab === 'installed') return tab;
  return 'catalog';
};

export { emptyKind };
