/* @layer core @kind logic */
import type { GgClient } from '../archipelago-gg/client.type';
import type { RoomStatus } from '../archipelago-gg/archipelago-gg.type';

const isStopped = ({ last_activity, timeout }: RoomStatus, now: number) => Date.parse(last_activity) + timeout * 1000 < now;

const waitForRoomStop = async (client: GgClient, room: string, everyMs: number, timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (isStopped(await client.roomStatus(room), Date.now())) return true;
    await new Promise((resolve) => setTimeout(resolve, everyMs));
  }
  return false;
};

export { waitForRoomStop };
