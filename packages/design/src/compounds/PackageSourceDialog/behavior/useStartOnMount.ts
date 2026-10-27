/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';

const useStartOnMount = (startable: boolean, start: () => void): void => {
  const latest = useRef({ startable, start });
  latest.current = { startable, start };
  const started = useRef(false);
  useEffect(() => {
    if (started.current || !latest.current.startable) return;
    started.current = true;
    latest.current.start();
  }, []);
};

export { useStartOnMount };
