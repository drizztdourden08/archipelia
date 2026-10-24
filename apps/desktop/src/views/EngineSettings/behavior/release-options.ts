/* @layer renderer-app @kind logic */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { EngineOverview } from '@archipelia/model';
import { unlistedVersions } from './unlisted-versions';
import { versionOption } from './version-option';

const releaseOptions = ({ feed, active, installed }: EngineOverview): SettingsOption[] => {
  const listed = feed.releases.map((release) => release.version);
  const kept = installed.map((engine) => engine.ap);
  const note = (version: string) => [version === listed[0] && 'latest', version === active?.ap && 'in use', version !== active?.ap && kept.includes(version) && 'installed'];
  return [...listed, ...unlistedVersions(kept, listed)].map((version) => versionOption(version, note(version)));
};

export { releaseOptions };
