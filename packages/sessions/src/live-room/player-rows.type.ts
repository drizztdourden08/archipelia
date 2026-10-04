/* @layer core @kind types */
import type { RoomPlayer, WatchedChecks } from './live-room.type';

type PlayerRowsInput = {
  players: readonly RoomPlayer[];
  statuses: Readonly<Record<string, unknown>>;
  watched: WatchedChecks | null;
  logChecks: Readonly<Record<string, number>>;
  online?: Readonly<Record<string, boolean>>;
};

export type { PlayerRowsInput };
