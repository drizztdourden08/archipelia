/* @layer client-kit @kind logic */
import type { ApworldIndex } from '../index-manifest/index.type';
import type { ReleaseManifest } from './release.type';

const indexOfRelease = ({ game, module, worldVersion, appVersion, minimumAp, maximumAp, builds }: ReleaseManifest): ApworldIndex | undefined => {
  if (builds === undefined || appVersion === undefined) return undefined;
  return { game, module, worldVersion, appVersion, minimumAp, ...(maximumAp === undefined ? {} : { maximumAp }), builds };
};

export { indexOfRelease };
