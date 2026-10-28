/* @layer core @kind logic */
import { fitEntries } from '../first-party/fit-entries';
import { releaseVersion } from '../first-party/release-version';
import type { CheckParams } from './check-release.type';
import { entryAtTag } from './entry-at-tag';
import { releaseStateOf } from './release-state-of';
import { NOT_CHECKED, NO_MANIFEST, UNREADABLE } from './versions.constants';
import type { Checked } from './versions.type';

const buildReason = (ap: string | undefined, builds: string[]): Checked =>
  (ap === undefined || builds.includes(ap) ? {} : { reason: `No build for Archipelago ${ap}; builds exist for ${builds.join(', ')}` });

const checkRelease = (params: CheckParams): Checked => {
  const { entry, game, ap, release, asset, builds, manifest, checked } = params;
  if (!asset) return { reason: NO_MANIFEST };
  if (builds.length > 0) return buildReason(ap, builds);
  if (!checked) return { reason: NOT_CHECKED };
  if (manifest === undefined) return { reason: UNREADABLE };
  try {
    const tagged = entryAtTag({ entry, game, state: releaseStateOf(manifest, asset, game), tag: release.tag });
    const reason = fitEntries([tagged], ap)[0]?.unavailable;
    const version = releaseVersion(tagged);
    return { ...(version ? { version } : {}), ...(reason ? { reason } : {}) };
  } catch (error) {
    return { reason: error instanceof Error ? error.message : String(error) };
  }
};

export { checkRelease };
