/* @layer renderer-app @kind logic */
import type { LiveRoomTarget } from '../widgets/live-room/live-room.type';
import { targetKey } from '../widgets/live-room/target-key';
import { useLiveRoomStore } from './useLiveRoomStore';

let holders = 0;

let heldKey = '';

const holdLiveRoom = (target: LiveRoomTarget): (() => void) => {
  holders += 1;
  const key = targetKey(target);
  if (key !== heldKey) {
    heldKey = key;
    void useLiveRoomStore.getState().connect(target);
  }
  return () => {
    holders -= 1;
    if (holders > 0) return;
    heldKey = '';
    useLiveRoomStore.getState().disconnect();
  };
};

export { holdLiveRoom };
