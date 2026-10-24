/* @layer renderer-app @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core/format';
import type { EngineEntry } from '@archipelia/model';
import { MANY_ENGINES, SECTION_TEXT } from '../EngineSettings.constants';

const installedSummary = (engines: readonly EngineEntry[]): string => {
  if (engines.length <= MANY_ENGINES) return SECTION_TEXT.installed.description;
  const total = engines.reduce((sum, engine) => sum + (engine.bytes ?? 0), 0);
  return `${SECTION_TEXT.installed.description} ${engines.length} engines use ${formatBytes(total)}. Remove the ones you no longer need.`;
};

export { installedSummary };
