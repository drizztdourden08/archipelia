/* @layer renderer-app @kind logic */
import type { LiveRoomTarget } from '@archipelia/sessions/live-room';
import { targetKey } from '@archipelia/sessions/live-room';
import { useLiveRoomStore } from '../../../stores/useLiveRoomStore';

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
