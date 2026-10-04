/* @layer renderer-app @kind logic */
import { registerSearchActions } from '@drizztdourden08/brock-react';
import { hostingRoom } from '../rooms/hosting-room';
import { useRunsStore } from '../stores/useRunsStore';
import { searchActionsFor } from './search-actions-for';

const watchSearchActions = (): void => {
  let shown: string | null = null;
  let unregister = (): void => undefined;
  const sync = (): void => {
    const room = hostingRoom(useRunsStore.getState().runs);
    const key = room?.id ?? '';
    if (key === shown) return;
    shown = key;
    unregister();
    unregister = registerSearchActions(searchActionsFor(room));
  };
  sync();
  useRunsStore.subscribe(sync);
};

export { watchSearchActions };
