/* @layer renderer-app @kind logic */
import type { EngineOverview } from '@archipelia/model';
import { NO_PLAN } from '../EngineSettings.constants';
import type { ChoicePlan, Picked } from '../EngineSettings.type';
import { pythonRelease } from './python-release';

const choicePlan = (overview: EngineOverview | null, { ap, python }: Picked): ChoicePlan => {
  if (!overview || !ap || !python) return NO_PLAN;
  const same = overview.installed.find((engine) => engine.ap === ap && engine.python === python && engine.state === 'ready');
  if (same) return same.id === overview.active?.id ? NO_PLAN : { kind: 'switch', id: same.id };
  const release = pythonRelease(overview, python);
  return release ? { kind: 'install', choice: { ap, python, pythonRelease: release } } : NO_PLAN;
};

export { choicePlan };
