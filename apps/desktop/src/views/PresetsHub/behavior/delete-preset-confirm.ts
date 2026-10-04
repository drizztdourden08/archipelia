/* @layer renderer-app @kind logic */
import type { ConfirmDeleteOptions } from '@drizztdourden08/brock-react';
import type { GamePreset } from '@archipelia/model';

const deletePresetConfirm = (preset: GamePreset): ConfirmDeleteOptions => ({
  what: preset.name,
  consequence: 'Sessions that use it will need another preset.',
});

export { deletePresetConfirm };
