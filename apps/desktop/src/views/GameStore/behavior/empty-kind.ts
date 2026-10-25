/* @layer renderer-app @kind logic */
import type { EmptyKind } from '../GameStore.type';

const emptyKind = (filtered: boolean, loading: boolean): EmptyKind => {
  if (loading) return 'loading';
  return filtered ? 'search' : 'none';
};

export { emptyKind };
