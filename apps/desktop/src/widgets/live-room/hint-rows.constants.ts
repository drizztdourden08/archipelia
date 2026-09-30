/* @layer renderer-app @kind config */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { HintState } from './live-room.type';

const STATE_BY_CODE: Record<number, HintState> = { 10: 'no priority', 20: 'avoid', 30: 'priority', 40: 'found' };

const STATE_ORDER: Record<HintState, number> = { priority: 0, open: 1, 'no priority': 2, avoid: 3, found: 4 };

const HINT_TONE: Record<HintState, StatusTone> = {
  priority: 'warning', open: 'warning', 'no priority': 'neutral', avoid: 'danger', found: 'success',
};

export { HINT_TONE, STATE_BY_CODE, STATE_ORDER };
