/* @layer renderer-app @kind logic */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { EngineOverview } from '@archipelia/model';
import { unlistedVersions } from './unlisted-versions';
import { versionOption } from './version-option';

const pythonOptions = ({ feed, active, installed }: EngineOverview): SettingsOption[] => {
  const listed = feed.python.map((build) => build.version);
  const kept = installed.map((engine) => engine.python);
  const tested = (version: string) => feed.python.some((build) => build.version === version && build.pinned);
  const note = (version: string) => [tested(version) && 'tested with this app', version === active?.python && 'in use', version !== active?.python && kept.includes(version) && 'installed'];
  return [...listed, ...unlistedVersions(kept, listed)].map((version) => versionOption(version, note(version)));
};

export { pythonOptions };
