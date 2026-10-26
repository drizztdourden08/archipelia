/* @layer renderer-app @kind hook */
import { scrollToAnchor, useNavigation } from '@drizztdourden08/brock-react';
import type { VirtualGridHandle } from '@drizztdourden08/tessera/composites';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { GameSectionRows } from '../GameStore.type';
import { gameAnchor } from './game-anchor';
import { indexOfGame } from './index-of-game';

const useRevealGame = (sections: readonly GameSectionRows[], grid: RefObject<VirtualGridHandle | null>): void => {
  const { params } = useNavigation();
  const handled = useRef<unknown>(null);
  const requested = typeof params.game === 'string' ? params.game : undefined;

  useEffect(() => {
    if (requested === undefined || handled.current === params) return;
    const index = indexOfGame(sections, requested);
    if (index < 0) return;
    handled.current = params;
    grid.current?.scrollToIndex(index, 'center');
    scrollToAnchor(gameAnchor(requested));
  }, [requested, params, sections, grid]);
};

export { useRevealGame };
