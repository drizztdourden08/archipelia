/* @layer renderer-app @kind logic */
import type { LiveRoomTarget } from '@archipelia/sessions/live-room';
import { targetKey } from '@archipelia/sessions/live-room';
import { appApi } from '../../../ipc/app-api';
import { useLiveRoomStore } from '../../../stores/useLiveRoomStore';

let holders = 0;

let heldKey = '';

const connectHeld = async (target: LiveRoomTarget, key: string): Promise<void> => {
  const password = await appApi().sessionsRoomPassword(target.sessionId).catch(() => null);
  if (heldKey === key) await useLiveRoomStore.getState().connect(target, password ?? '');
};

const holdLiveRoom = (target: LiveRoomTarget): (() => void) => {
  holders += 1;
  const key = targetKey(target);
  if (key !== heldKey) {
    heldKey = key;
    void connectHeld(target, key);
  }
  return () => {
    holders -= 1;
    if (holders > 0) return;
    heldKey = '';
    useLiveRoomStore.getState().disconnect();
  };
};

export { holdLiveRoom };
