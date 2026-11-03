/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { FreshSlots } from '../SessionLobby.type';

const useFreshSlots = (): FreshSlots => {
  const [fresh, setFresh] = useState<ReadonlySet<string>>(() => new Set());
  const mark = useCallback((name: string) => setFresh((current) => new Set(current).add(name.toLowerCase())), []);
  const settle = useCallback((name: string) => setFresh((current) => {
    const next = new Set(current);
    next.delete(name.toLowerCase());
    return next;
  }), []);
  return useMemo(() => ({ fresh, mark, settle }), [fresh, mark, settle]);
};

export { useFreshSlots };
