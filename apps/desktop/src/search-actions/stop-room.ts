/* @layer renderer-app @kind logic */
import { confirmAction, toast } from '@drizztdourden08/brock-react';
import type { Session } from '@archipelia/model';
import { STOP_ROOM_CONFIRM } from '../rooms/stop-room-confirm.constants';
import { useRunsStore } from '../stores/useRunsStore';

const stopRoom = async (room: Session): Promise<void> => {
  if (!(await confirmAction(STOP_ROOM_CONFIRM))) return;
  try {
    await useRunsStore.getState().stop(room.id);
    toast(`Stopped ${room.snapshot.name}`, { variant: 'success' });
  } catch (err) {
    toast(`${room.snapshot.name} did not stop: ${(err as Error).message}`, { variant: 'danger' });
  }
};

export { stopRoom };
