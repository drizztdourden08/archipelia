/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { createVersions } from '../versions/create-versions';
import type { VersionList, VersionsRequest } from '../versions/versions.type';
import type { InstallRequest, Latest } from './catalog-service.type';
import type { ReleasePortDeps } from './create-release-port.type';

const createReleasePort = ({ cache, fetch: request, activeAp, indexEntry }: ReleasePortDeps) => {
  const releases = createVersions({ files: cache, ...(request ? { fetch: request } : {}) });

  const chosen = async (wanted: Extract<InstallRequest, { kind: 'index' }>, entry: CatalogEntry, current: Latest) => {
    if (!wanted.tag) return { entry, version: wanted.version };
    return releases.pin({ entry, registry: current.firstParty.registry, ap: await activeAp(), tag: wanted.tag });
  };

  const versions = async (wanted: VersionsRequest): Promise<VersionList> => {
    if (wanted.source === 'official') return { by: 'version', choices: [] };
    const { entry, latest: current } = await indexEntry(wanted.apworld);
    return releases.list({ entry, registry: current.firstParty.registry, ap: await activeAp() });
  };

  return { chosen, versions };
};

export { createReleasePort };
