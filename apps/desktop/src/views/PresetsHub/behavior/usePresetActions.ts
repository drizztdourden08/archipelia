/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmDelete } from '@drizztdourden08/brock-react';
import type { GamePreset } from '@archipelia/model';
import type { ActionParams } from '../PresetsHub.type';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { deletePresetConfirm } from './delete-preset-confirm';
import { logFailure } from '../../../hooks/log-failure';
import { FAILURE } from '../PresetsHub.constants';

const usePresetActions = ({ select, report }: ActionParams) => {
  const { duplicatePreset, removePreset } = useLibraryStore();

  const duplicate = useCallback(async (preset: GamePreset) => {
    try {
      const copy = await duplicatePreset(preset.id, `${preset.name} copy`);
      select(copy.id);
    } catch (err) {
      logFailure(FAILURE.duplicate, err);
      report(FAILURE.duplicate);
    }
  }, [duplicatePreset, select, report]);

  const remove = useCallback(async (preset: GamePreset) => {
    try {
      await removePreset(preset.id);
    } catch (err) {
      logFailure(FAILURE.remove, err);
      report(FAILURE.remove);
    }
  }, [removePreset, report]);

  const requestDelete = useCallback((preset: GamePreset) => {
    void confirmDelete(deletePresetConfirm(preset)).then((confirmed) => { if (confirmed) void remove(preset); });
  }, [remove]);

  return { duplicate, requestDelete };
};

export { usePresetActions };
