/* @layer renderer-app @kind logic */
import { pickPythonBuild, versionLine } from '@archipelia/engine/versions';
import type { EngineOverview } from '@archipelia/model';
import type { Picked } from '../EngineSettings.type';
import { pythonOptions } from './python-options';
import { releaseOptions } from './release-options';

const firstValid = (values: readonly string[], ...wanted: (string | undefined)[]): string | undefined =>
  wanted.find((value) => value !== undefined && values.includes(value));

const movedPython = (overview: EngineOverview, ap: string | undefined, python: string | undefined): Picked => {
  const range = ap ? overview.ranges[ap] : undefined;
  const options = pythonOptions(overview, ap);
  const current = options.find((option) => option.value === python);
  if (!range || !python || !current?.disabled) return {};
  const build = pickPythonBuild(overview.feed.python, range, versionLine(python));
  return build ? { python: build.version, note: `Python ${python} does not fit Archipelago ${ap}. The newest fitting build, ${build.version}, is picked.` } : {};
};

const chosenVersions = (overview: EngineOverview | null, picked: Picked): Picked => {
  if (!overview) return {};
  const aps = releaseOptions(overview).map((option) => option.value);
  const ap = firstValid(aps, picked.ap, overview.active?.ap, overview.feed.releases[0]?.version);
  const pythons = pythonOptions(overview).map((option) => option.value);
  const tested = overview.feed.python.find((build) => build.pinned)?.version;
  const python = firstValid(pythons, picked.python, overview.active?.python, tested, overview.feed.python[0]?.version);
  return { ap, python, ...movedPython(overview, ap, python) };
};

export { chosenVersions };
