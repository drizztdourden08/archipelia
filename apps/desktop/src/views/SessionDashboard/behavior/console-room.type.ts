/* @layer renderer-app @kind types */
import type { RoomNames, RoomPlayer } from '@archipelia/sessions/live-room';

type ConsoleRoom = { players: readonly RoomPlayer[]; names: RoomNames };

export type { ConsoleRoom };
