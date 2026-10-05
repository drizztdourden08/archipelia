/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmDelete, toast } from '@drizztdourden08/brock-react';
import type { GamePreset } from '@archipelia/model';
import type { ActionParams } from '../PresetsHub.type';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { deletePresetConfirm } from './delete-preset-confirm';
import { logFailure } from '../../../hooks/log-failure';
import { FAILURE } from '../PresetsHub.constants';

const usePresetActions = ({ selectedId, select, follow }: ActionParams) => {
  const { duplicatePreset, removePreset } = useLibraryStore();

  const duplicate = useCallback(async (preset: GamePreset) => {
    try {
      const copy = await duplicatePreset(preset.id, `${preset.name} copy`);
      follow(copy.id);
    } catch (err) {
      logFailure(FAILURE.duplicate, err);
      toast(FAILURE.duplicate, { variant: 'danger' });
    }
  }, [duplicatePreset, follow]);

  const remove = useCallback(async (id: string) => {
    try {
      await removePreset(id);
      if (id === selectedId) select(null);
    } catch (err) {
      logFailure(FAILURE.remove, err);
      toast(FAILURE.remove, { variant: 'danger' });
    }
  }, [removePreset, selectedId, select]);

  const removeNow = useCallback((id: string) => { void remove(id); }, [remove]);

  const requestDelete = useCallback((preset: GamePreset) => {
    void confirmDelete(deletePresetConfirm(preset)).then((confirmed) => { if (confirmed) void remove(preset.id); });
  }, [remove]);

  return { duplicate, removeNow, requestDelete };
};

export { usePresetActions };
