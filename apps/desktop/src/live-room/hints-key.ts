/* @layer renderer-app @kind logic */
import { HINTS_KEY_PREFIX } from './client-status.constants';

const hintsKey = (team: number, slot: number) => `${HINTS_KEY_PREFIX}${team}_${slot}`;

export { hintsKey };
