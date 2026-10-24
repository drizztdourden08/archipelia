/* @layer core @kind logic */
import type { EngineStateFile, InstalledEngine } from '@archipelia/model';

const findInstalledEngine = (state: EngineStateFile, ap: string, python: string, target: string): InstalledEngine | undefined =>
  state.installed.find((entry) => entry.ap === ap && entry.python === python && entry.target === target);

export { findInstalledEngine };
