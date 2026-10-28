/* @layer core @kind logic */
import type { WorldTrust } from '@archipelia/model';
import { notReviewedTrust } from './not-reviewed-trust';
import { vetRelease } from './vet-release';
import type { VetReleaseParams } from './vet-release.type';

const vetEntry = async (params: VetReleaseParams): Promise<WorldTrust | undefined> =>
  (params.entry.discovered ? notReviewedTrust(params.entry.discovered) : vetRelease(params));

export { vetEntry };
