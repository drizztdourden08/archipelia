/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { GamePreset } from '@archipelia/model';

const deletePresetConfirm = (preset: GamePreset): ConfirmActionOptions => ({
  title: 'Delete preset',
  message: `Delete ${preset.name}? Sessions that use it will need another preset.`,
  confirmLabel: 'Delete',
  variant: 'danger',
});

export { deletePresetConfirm };
