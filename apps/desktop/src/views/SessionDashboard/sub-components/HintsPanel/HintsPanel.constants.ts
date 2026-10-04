/* @layer renderer-app @kind config */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { HintState } from '@archipelia/sessions/live-room';

const HINT_TONE: Record<HintState, StatusTone> = {
  priority: 'warning', open: 'warning', 'no priority': 'neutral', avoid: 'danger', found: 'success',
};

export { HINT_TONE };
