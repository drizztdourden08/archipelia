/* @layer renderer-app @kind logic */
import type { EngineEntry } from '@archipelia/model';
import { ACTIVE_LOOK, FAILED_CHECK, FAILED_LOOK, FAILED_UNKNOWN, LAST_GOOD_LOOK } from '../EngineSettings.constants';
import type { EngineTag } from '../EngineSettings.type';

const engineTags = (engine: EngineEntry, activeId: string | undefined): EngineTag[] => {
  const failed = engine.smoke?.failed;
  return [
    ...(engine.id === activeId ? [{ key: 'active', label: 'Active', look: ACTIVE_LOOK }] : []),
    ...(engine.lastGood ? [{ key: 'last-good', label: 'Last good', look: LAST_GOOD_LOOK, title: 'The engine in use before the last switch.' }] : []),
    ...(engine.state === 'failed' ? [{ key: 'failed', label: 'Failed', look: FAILED_LOOK, title: failed ? FAILED_CHECK[failed] : FAILED_UNKNOWN }] : []),
  ];
};

export { engineTags };
