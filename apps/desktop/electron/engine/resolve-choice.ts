/* @layer electron-main @kind logic */
import { checkPythonFit, createEngineSpec, ENGINE_DEFAULTS, versionLine } from '@archipelia/engine';
import type { EngineChoice, EngineStateFile, PythonBuild } from '@archipelia/model';
import type { VersionSource } from './engine-service.type';
import type { ResolvedChoice } from './install-engine.type';

const findBuild = (builds: PythonBuild[], { python, pythonRelease }: EngineChoice) =>
  builds.find((build) => build.version === python && build.release === pythonRelease);

const resolveChoice = async (source: VersionSource, choice: EngineChoice, state: EngineStateFile): Promise<ResolvedChoice> => {
  const build = findBuild((await source.feed('cache-only')).python, choice) ?? findBuild((await source.feed('auto')).python, choice);
  if (!build) throw new Error(`Python ${choice.python} is not in the version list. Check now, then pick it again.`);
  const commit = await source.commitOf(choice.ap, state);
  const warnings: string[] = [];
  const range = await source.rangeOf(choice.ap, commit).catch((err: unknown) => {
    warnings.push(`Could not read the Python range of Archipelago ${choice.ap} (${(err as Error).message}). It is read again from the download.`);
    return undefined;
  });
  if (range) {
    const tested = ENGINE_DEFAULTS.defaultPython[build.target]?.version ?? build.version;
    const fit = checkPythonFit(build.version, range, choice.ap, versionLine(tested));
    if (!fit.fits) throw new Error(fit.hint ?? `Python ${build.version} does not fit Archipelago ${choice.ap}`);
    if (fit.hint) warnings.push(fit.hint);
  }
  return { spec: createEngineSpec({ ap: { version: choice.ap, commit }, python: build }), warnings };
};

export { resolveChoice };
