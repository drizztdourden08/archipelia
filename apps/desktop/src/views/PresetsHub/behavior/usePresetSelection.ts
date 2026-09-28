/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';

const usePresetSelection = (requestedId: string | undefined) => {
  const [selectedId, setSelectedId] = useState<string | null>(requestedId ?? null);
  const [pendingId, setPendingId] = useState<string | null | undefined>(undefined);
  const dirty = useRef(false);

  const setDirty = useCallback((next: boolean) => { dirty.current = next; }, []);

  const select = useCallback((id: string | null) => {
    if (id === selectedId) return;
    if (dirty.current) setPendingId(id);
    else setSelectedId(id);
  }, [selectedId]);

  useEffect(() => { if (requestedId) select(requestedId); }, [requestedId]);

  const confirmDiscard = useCallback(() => {
    dirty.current = false;
    setSelectedId(pendingId ?? null);
    setPendingId(undefined);
  }, [pendingId]);

  const cancelDiscard = useCallback(() => setPendingId(undefined), []);

  return { cancelDiscard, confirmDiscard, discardOpen: pendingId !== undefined, select, selectedId, setDirty };
};

export { usePresetSelection };
