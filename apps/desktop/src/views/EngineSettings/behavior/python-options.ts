/* @layer renderer-app @kind logic */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import { checkPythonFit, versionLine } from '@archipelia/engine/versions';
import type { EngineOverview } from '@archipelia/model';
import { unlistedVersions } from './unlisted-versions';
import { versionOption } from './version-option';

const pythonOptions = ({ feed, active, installed, ranges }: EngineOverview, ap?: string): SettingsOption[] => {
  const listed = feed.python.map((build) => build.version);
  const kept = installed.map((engine) => engine.python);
  const tested = (version: string) => feed.python.some((build) => build.version === version && build.pinned);
  const testedLine = versionLine(feed.python.find((build) => build.pinned)?.version ?? active?.python ?? '3.12');
  const range = ap ? ranges[ap] : undefined;
  const fit = (version: string) => (range && ap ? checkPythonFit(version, range, ap, testedLine) : { fits: true });
  const note = (version: string) => [
    tested(version) && 'tested with this app', version === active?.python && 'in use', version !== active?.python && kept.includes(version) && 'installed',
    fit(version).fits && (fit(version).hint ?? false),
  ];
  return [...listed, ...unlistedVersions(kept, listed)].map((version) => {
    const option = versionOption(version, note(version));
    const check = fit(version);
    return check.fits ? option : { ...option, disabled: check.hint ?? true };
  });
};

export { pythonOptions };
