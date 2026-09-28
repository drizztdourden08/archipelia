/* @layer renderer-app @kind logic */
import type { EngineState, EngineStatus } from '@archipelia/model';
import { BADGES } from '../EngineSettings.constants';

const stateBadge = (state: EngineState | undefined) => BADGES[state ?? 'unknown'];

const setupLabelOf = (state: EngineState | undefined) => (state === 'ready' ? 'Rebuild engine' : 'Set up engine');

const engineView = (status: EngineStatus | null) => {
  const state = status?.state;
  return {
    badge: stateBadge(state),
    building: state === 'building',
    apVersion: status?.apVersion ?? 'not installed',
    dir: status?.dir ?? '',
    error: status?.error,
    setupLabel: setupLabelOf(state),
  };
};

export { engineView };
