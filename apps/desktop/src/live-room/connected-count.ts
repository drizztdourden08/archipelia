/* @layer renderer-app @kind logic */
import type { PlayerView } from './live-room.type';

const connectedCount = (rows: readonly PlayerView[]) =>
  rows.filter((row) => row.status !== 'unknown' && row.status !== 'offline').length;

export { connectedCount };
