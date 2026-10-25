/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useServerStatusStore } from '../stores/useServerStatusStore';

const useLocalServerStatus = () => {
  const status = useServerStatusStore((state) => state.status);
  const setStatus = useServerStatusStore((state) => state.setStatus);
  const reload = useServerStatusStore((state) => state.reload);

  useEffect(() => { void reload(); }, [reload]);

  return { status, setStatus, reload };
};

export { useLocalServerStatus };
