/* @layer renderer-app @kind logic */
import type { InstalledEngine } from '@archipelia/model';
import { ACTIVE_LOOK, FAILED_CHECK, FAILED_LOOK, FAILED_UNKNOWN } from '../EngineSettings.constants';
import type { EngineTag } from '../EngineSettings.type';

const engineTags = (engine: InstalledEngine, activeId: string | undefined): EngineTag[] => {
  const failed = engine.smoke?.failed;
  return [
    ...(engine.id === activeId ? [{ key: 'active', label: 'Active', look: ACTIVE_LOOK }] : []),
    ...(engine.state === 'failed' ? [{ key: 'failed', label: 'Failed', look: FAILED_LOOK, title: failed ? FAILED_CHECK[failed] : FAILED_UNKNOWN }] : []),
  ];
};

export { engineTags };
