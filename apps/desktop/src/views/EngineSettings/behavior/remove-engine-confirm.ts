/* @layer renderer-app @kind logic */
import type { ConfirmDeleteOptions } from '@drizztdourden08/brock-react';
import type { EngineEntry } from '@archipelia/model';
import { ACTIVE_REMOVE_NOTE, KEPT_AFTER_REMOVE } from '../EngineSettings.constants';

const sessionsMoved = (count: number) =>
  (count === 1 ? '1 session was generated with it. It will be hosted with the engine in use.' : `${count} sessions were generated with it. They will be hosted with the engine in use.`);

const otherSessions = (engine: EngineEntry) => (engine.sessions > 0 ? sessionsMoved(engine.sessions) : KEPT_AFTER_REMOVE);

const removeEngineConfirm = (engine: EngineEntry, active = false): ConfirmDeleteOptions => ({
  what: `Archipelago ${engine.ap} with Python ${engine.python}`,
  consequence: active ? `Its files are deleted. ${ACTIVE_REMOVE_NOTE}` : `Its files are deleted. ${otherSessions(engine)}`,
  confirmLabel: 'Remove',
});

export { removeEngineConfirm };
