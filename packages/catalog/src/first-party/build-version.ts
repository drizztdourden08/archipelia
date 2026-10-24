/* @layer core @kind logic */
import type { CatalogVersion, FirstPartyBuild, FirstPartyRelease } from '@archipelia/model';
import { UNKNOWN_VERSION } from './build-version.constants';

const buildVersion = (release: FirstPartyRelease, build: FirstPartyBuild): CatalogVersion => ({
  version: release.worldVersion ?? UNKNOWN_VERSION,
  url: build.url,
  sha256: build.sha256,
  size: build.size,
});

export { buildVersion };
