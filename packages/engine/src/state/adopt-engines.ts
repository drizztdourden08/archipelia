/* @layer core @kind logic */
import type { EngineStateFile, InstalledEngine } from '@archipelia/model';
import { readdir } from 'node:fs/promises';
import { compareVersions } from '../versions/compare-versions';
import { adoptOneEngine } from './adopt-one-engine';
import type { AdoptParams } from './adopt-one-engine.type';
import { DOWNLOADS_DIR, STATE_VERSION } from './engine-state.constants';
import { writeEngineState } from './write-engine-state';

const newestFirst = (a: InstalledEngine, b: InstalledEngine) => compareVersions(b.ap, a.ap) || b.builtAt - a.builtAt;

const adoptEngines = async ({ engineRoot, defaults, target }: Omit<AdoptParams, 'name'>): Promise<EngineStateFile> => {
  const entries = await readdir(engineRoot, { withFileTypes: true }).catch(() => []);
  const names = entries.filter((entry) => entry.isDirectory() && entry.name !== DOWNLOADS_DIR).map((entry) => entry.name);
  const found = await Promise.all(names.map((name) => adoptOneEngine({ engineRoot, name, defaults, target }).catch(() => undefined)));
  const installed = found.filter((engine): engine is InstalledEngine => engine !== undefined).sort(newestFirst);
  const active = installed.find((engine) => engine.ap === defaults.defaultAp.version) ?? installed[0];
  const state: EngineStateFile = {
    version: STATE_VERSION,
    ...(active ? { active: active.id, lastGood: active.id } : {}),
    installed,
  };
  if (installed.length > 0) await writeEngineState(engineRoot, state);
  return state;
};

export { adoptEngines };
