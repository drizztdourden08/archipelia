/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useScreenState } from '@drizztdourden08/brock-react';
import type { PresetSave } from '../PresetsHub.type';

const usePresetSelection = (requestedId: string | undefined) => {
  const [selectedId, setSelectedId] = useScreenState<string | null>('selected', requestedId ?? null);
  const [dirty, setDirty] = useState(false);
  const saver = useRef<PresetSave | null>(null);

  const select = useCallback((id: string | null) => setSelectedId(id), [setSelectedId]);
  const follow = useCallback((id: string) => { if (!dirty) setSelectedId(id); }, [dirty, setSelectedId]);
  const bindSave = useCallback((save: PresetSave | null) => { saver.current = save; }, []);
  const save = useCallback(() => saver.current?.() ?? false, []);
  const discard = useCallback(() => setDirty(false), []);

  useEffect(() => { if (requestedId) setSelectedId(requestedId); }, [requestedId]);

  return { bindSave, dirty, discard, follow, save, select, selectedId, setDirty };
};

export { usePresetSelection };
