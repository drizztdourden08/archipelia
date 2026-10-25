/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { appApi } from '../ipc/app-api';
import type { PendingClose } from '../lobbies/lobbies.type';

const usePendingCloses = (templateId: string): PendingClose[] => {
  const [pending, setPending] = useState<PendingClose[]>([]);
  useEffect(() => {
    const api = appApi();
    const stop = api.onPendingCloses(setPending);
    api.lobbyPendingCloses().then(setPending, () => undefined);
    return stop;
  }, []);
  return pending.filter((entry) => entry.templateId === templateId);
};

export { usePendingCloses };
