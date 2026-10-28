/* @layer core @kind logic */
import { NOT_FOUND, NOT_MODIFIED } from './read-release-asset.constants';
import type { AssetRead } from './read-conditional-asset.type';

const statusRead = (res: Response, etag: string | undefined): AssetRead | undefined => {
  if (res.status === NOT_MODIFIED && etag) return { kind: 'same' };
  return res.status === NOT_FOUND ? { kind: 'missing' } : undefined;
};

export { statusRead };
