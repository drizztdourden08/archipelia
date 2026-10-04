/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';
import { ENGINE_LINE } from '../HomeView.constants';

const engineLine = (status: EngineStatus | null) => {
  if (!status) return 'Checking the engine';
  if (status.state === 'ready' && status.apVersion) return `Engine AP ${status.apVersion} ready`;
  return ENGINE_LINE[status.state];
};

export { engineLine };
