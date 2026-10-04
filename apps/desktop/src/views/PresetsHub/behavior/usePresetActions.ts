/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { GamePreset } from '@archipelia/model';
import type { ActionParams } from '../PresetsHub.type';
import { useLibraryStore } from '../../../stores/useLibraryStore';

const usePresetActions = ({ select, report }: ActionParams) => {
  const { duplicatePreset, removePreset } = useLibraryStore();
  const [deleting, setDeleting] = useState<GamePreset | null>(null);

  const duplicate = useCallback(async (preset: GamePreset) => {
    try {
      const copy = await duplicatePreset(preset.id, `${preset.name} copy`);
      select(copy.id);
    } catch (err) {
      report((err as Error).message);
    }
  }, [duplicatePreset, select, report]);

  const requestDelete = useCallback((preset: GamePreset) => setDeleting(preset), []);
  const cancelDelete = useCallback(() => setDeleting(null), []);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      await removePreset(deleting.id);
    } catch (err) {
      report((err as Error).message);
    } finally {
      setDeleting(null);
    }
  }, [deleting, removePreset, report]);

  return { cancelDelete, confirmDelete, deleting, duplicate, requestDelete };
};

export { usePresetActions };
