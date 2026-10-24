/* @layer renderer-app @kind logic */
import type { ConfirmDeleteOptions } from '@drizztdourden08/brock-react';
import type { InstalledEngine } from '@archipelia/model';
import { KEPT_AFTER_REMOVE } from '../EngineSettings.constants';

const removeEngineConfirm = (engine: InstalledEngine): ConfirmDeleteOptions => ({
  what: `Archipelago ${engine.ap} with Python ${engine.python}`,
  consequence: `Its files are deleted. ${KEPT_AFTER_REMOVE}`,
  confirmLabel: 'Remove',
});

export { removeEngineConfirm };
