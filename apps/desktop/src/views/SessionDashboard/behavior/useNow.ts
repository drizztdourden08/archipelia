/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';

const useNow = (intervalMs: number, active: boolean) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs, active]);
  return now;
};

export { useNow };
