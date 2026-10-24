/* @layer renderer-app @kind logic */
import type { ConfirmDeleteOptions } from '@drizztdourden08/brock-react';
import type { EngineEntry } from '@archipelia/model';
import { KEPT_AFTER_REMOVE } from '../EngineSettings.constants';

const sessionsMoved = (count: number) =>
  (count === 1 ? '1 session was generated with it. It will be hosted with the engine in use.' : `${count} sessions were generated with it. They will be hosted with the engine in use.`);

const removeEngineConfirm = (engine: EngineEntry): ConfirmDeleteOptions => ({
  what: `Archipelago ${engine.ap} with Python ${engine.python}`,
  consequence: `Its files are deleted. ${engine.sessions > 0 ? sessionsMoved(engine.sessions) : KEPT_AFTER_REMOVE}`,
  confirmLabel: 'Remove',
});

export { removeEngineConfirm };
