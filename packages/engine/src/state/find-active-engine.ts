/* @layer core @kind logic */
import type { EngineStateFile, InstalledEngine } from '@archipelia/model';

const findActiveEngine = (state: EngineStateFile): InstalledEngine | undefined =>
  state.installed.find((entry) => entry.id === state.active);

export { findActiveEngine };
