/* @layer core @kind logic */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { checkPythonFit } from '../versions/check-python-fit';
import { ENGINE_DEFAULTS } from '../versions/engine-defaults.constants';
import { resolvePythonRange } from '../versions/resolve-python-range';
import { versionLine } from '../versions/version-line';
import type { EngineSpec } from './engine-spec.type';

const verifyEngineSource = async (apRoot: string, spec: EngineSpec, platform: string = process.platform): Promise<string | undefined> => {
  const moduleUpdate = await readFile(join(apRoot, 'ModuleUpdate.py'), 'utf8').catch(() => undefined);
  const range = resolvePythonRange({ moduleUpdate, platform, ap: spec.ap.version, defaults: ENGINE_DEFAULTS });
  const tested = ENGINE_DEFAULTS.defaultPython[spec.target]?.version ?? spec.python.version;
  const fit = checkPythonFit(spec.python.version, range, spec.ap.version, versionLine(tested));
  if (!fit.fits) throw new Error(fit.hint ?? `Python ${spec.python.version} does not fit Archipelago ${spec.ap.version}`);
  return fit.hint;
};

export { verifyEngineSource };
