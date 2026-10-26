/* @layer core @kind logic */
import type { SourceWheelRequest } from '@archipelia/model';
import type { AssetFact } from './wheel.type';
import { NO_DIGEST } from './prepare-wheel.constants';

const assertConfirmed = (asset: AssetFact, { owner, repo, typed }: SourceWheelRequest): void => {
  if (asset.digest === undefined && typed?.trim().toLowerCase() !== `${owner}/${repo}`.toLowerCase()) throw new Error(NO_DIGEST);
};

export { assertConfirmed };
