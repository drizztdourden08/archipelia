/* @layer core @kind logic */
import type { PlayerFile } from '@archipelia/model';
import type { ReleaseState } from './first-party.type';

const statePlayerFile = (state: ReleaseState): { playerFile?: PlayerFile } => {
  if (state.kind !== 'found' && state.kind !== 'builds') return {};
  const { playerFile } = state.manifest;
  return playerFile ? { playerFile } : {};
};

export { statePlayerFile };
