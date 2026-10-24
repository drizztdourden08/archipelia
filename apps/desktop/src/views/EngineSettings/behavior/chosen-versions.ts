/* @layer renderer-app @kind logic */
import type { EngineOverview } from '@archipelia/model';
import type { Picked } from '../EngineSettings.type';
import { pythonOptions } from './python-options';
import { releaseOptions } from './release-options';

const firstValid = (values: readonly string[], ...wanted: (string | undefined)[]): string | undefined =>
  wanted.find((value) => value !== undefined && values.includes(value));

const chosenVersions = (overview: EngineOverview | null, picked: Picked): Picked => {
  if (!overview) return {};
  const aps = releaseOptions(overview).map((option) => option.value);
  const pythons = pythonOptions(overview).map((option) => option.value);
  const tested = overview.feed.python.find((build) => build.pinned)?.version;
  return {
    ap: firstValid(aps, picked.ap, overview.active?.ap, overview.feed.releases[0]?.version),
    python: firstValid(pythons, picked.python, overview.active?.python, tested, overview.feed.python[0]?.version),
  };
};

export { chosenVersions };
