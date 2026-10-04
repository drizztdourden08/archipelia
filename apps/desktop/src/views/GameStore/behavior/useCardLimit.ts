/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { MAX_CARDS } from '../GameStore.constants';

const useCardLimit = (total: number, resetKey: string) => {
  const [state, setState] = useState({ key: resetKey, limit: MAX_CARDS });
  const limit = state.key === resetKey ? state.limit : MAX_CARDS;
  const showMore = useCallback(() => setState({ key: resetKey, limit: limit + MAX_CARDS }), [limit, resetKey]);
  return { hidden: total > limit, shown: Math.min(limit, total), showMore, total };
};

export { useCardLimit };
