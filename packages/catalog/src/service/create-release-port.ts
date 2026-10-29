/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { createVersions } from '../versions/create-versions';
import type { VersionList, VersionsRequest } from '../versions/versions.type';
import type { InstallRequest, Latest } from './catalog-service.type';
import type { ReleasePortDeps } from './create-release-port.type';

const createReleasePort = ({ cache, fetch: request, readReleases, activeAp, indexEntry }: ReleasePortDeps) => {
  const releases = createVersions({ files: cache, readReleases, ...(request ? { fetch: request } : {}) });

  const chosen = async (wanted: Extract<InstallRequest, { kind: 'index' }>, entry: CatalogEntry, current: Latest) => {
    const params = { entry, registry: current.firstParty.registry, ap: await activeAp() };
    if (wanted.tag !== undefined) return releases.pin({ ...params, tag: wanted.tag });
    return (await releases.current(params)) ?? { entry, version: wanted.version };
  };

  const versions = async (wanted: VersionsRequest): Promise<VersionList> => {
    if (wanted.source === 'official') return { by: 'version', choices: [] };
    const { entry, latest: current } = await indexEntry(wanted.apworld);
    return releases.list({ entry, registry: current.firstParty.registry, ap: await activeAp() });
  };

  return { chosen, versions };
};

export { createReleasePort };
