/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { COMMIT_SHA } from '../source/source.constants';
import type { WheelLabel } from './wheel.type';
import { ASSET_NAME, SHA256, TAG_NAME } from './wheel.constants';

const builtOf = (value: Record<string, unknown>): Pick<WheelLabel, 'built' | 'commit' | 'archiveSha256'> => {
  if (value.built !== true) return {};
  const { commit, archiveSha256 } = value;
  if (typeof commit !== 'string' || !COMMIT_SHA.test(commit) || typeof archiveSha256 !== 'string' || !SHA256.test(archiveSha256)) throw new Error('unreadable');
  return { built: true, commit, archiveSha256 };
};

const labelOf = (text: string): WheelLabel => {
  const value: unknown = JSON.parse(text);
  if (!isRecord(value)) throw new Error('unreadable');
  const { repo, tag, asset, verified, newest } = value;
  if (typeof repo !== 'string' || typeof tag !== 'string' || !TAG_NAME.test(tag) || typeof asset !== 'string' || !ASSET_NAME.test(asset) || typeof verified !== 'boolean') {
    throw new Error('unreadable');
  }
  return { repo, tag, asset, verified, newest: typeof newest === 'string' && TAG_NAME.test(newest) ? newest : undefined, ...builtOf(value) };
};

export { labelOf };
