/* @layer core @kind logic */
import { compareVersions } from '@archipelia/engine';
import type { VersionList, VersionsParams } from './versions.type';

const listIndexVersions = ({ entry }: Pick<VersionsParams, 'entry'>): VersionList => {
  const choices = [...entry.versions]
    .sort((a, b) => compareVersions(b.version, a.version))
    .map(({ version }) => ({ id: version, label: version, prerelease: false, version }));
  const first = choices[0];
  return { by: 'version', choices, ...(first ? { defaultId: first.id, latestId: first.id } : {}) };
};

export { listIndexVersions };
