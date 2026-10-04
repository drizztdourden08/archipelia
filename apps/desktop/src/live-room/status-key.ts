/* @layer renderer-app @kind logic */
import { STATUS_KEY_PREFIX } from './client-status.constants';

const statusKey = (team: number, slot: number) => `${STATUS_KEY_PREFIX}${team}_${slot}`;

export { statusKey };
