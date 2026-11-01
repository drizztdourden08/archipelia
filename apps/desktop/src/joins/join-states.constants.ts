/* @layer renderer-app @kind config */
import type { JoinState } from './joins.type';

const FINAL_STATES: readonly JoinState[] = ['refused', 'ended'];

const LIVE_STATES: readonly JoinState[] = ['connecting', 'pending', 'approved', 'started'];

export { FINAL_STATES, LIVE_STATES };
