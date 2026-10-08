/* @layer renderer-app @kind logic */
import type { EngineState, EngineStatus } from '@archipelia/model';
import { STATE_VIEW } from '../EngineSettings.constants';

const stateView = (state: EngineState | undefined) => STATE_VIEW[state ?? 'unknown'];

const engineView = (status: EngineStatus | null) => {
  const state = status?.state;
  return {
    state: stateView(state),
    building: state === 'building',
    ready: state === 'ready',
    apVersion: status?.apVersion ?? 'not installed',
    dir: status?.dir ?? '',
    openable: Boolean(status?.dir) && state !== undefined && state !== 'missing',
    error: status?.error,
  };
};

export { engineView };
