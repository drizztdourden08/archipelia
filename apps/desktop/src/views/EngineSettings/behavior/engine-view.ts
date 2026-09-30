/* @layer renderer-app @kind logic */
import type { EngineState, EngineStatus } from '@archipelia/model';
import { STATE_VIEW } from '../EngineSettings.constants';

const stateView = (state: EngineState | undefined) => STATE_VIEW[state ?? 'unknown'];

const setupLabelOf = (state: EngineState | undefined) => (state === 'ready' ? 'Rebuild engine' : 'Set up engine');

const engineView = (status: EngineStatus | null) => {
  const state = status?.state;
  return {
    state: stateView(state),
    building: state === 'building',
    apVersion: status?.apVersion ?? 'not installed',
    dir: status?.dir ?? '',
    error: status?.error,
    setupLabel: setupLabelOf(state),
  };
};

export { engineView };
