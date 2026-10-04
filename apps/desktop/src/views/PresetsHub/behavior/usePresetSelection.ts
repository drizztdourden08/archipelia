/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { DISCARD_CONFIRM } from '../PresetsHub.constants';

const usePresetSelection = (requestedId: string | undefined) => {
  const [selectedId, setSelectedId] = useState<string | null>(requestedId ?? null);
  const dirty = useRef(false);

  const setDirty = useCallback((next: boolean) => { dirty.current = next; }, []);

  const select = useCallback((id: string | null) => {
    if (id === selectedId) return;
    if (!dirty.current) {
      setSelectedId(id);
      return;
    }
    void confirmAction(DISCARD_CONFIRM).then((confirmed) => {
      if (!confirmed) return;
      dirty.current = false;
      setSelectedId(id);
    });
  }, [selectedId]);

  useEffect(() => { if (requestedId) select(requestedId); }, [requestedId]);

  return { select, selectedId, setDirty };
};

export { usePresetSelection };
