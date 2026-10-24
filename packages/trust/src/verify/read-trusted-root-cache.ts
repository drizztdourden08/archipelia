/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { DataFiles } from '@archipelia/model';
import { TrustedRoot } from '@sigstore/protobuf-specs';
import { TRUSTED_ROOT_FILE } from './trusted-root.constants';

const readTrustedRootCache = async (files: DataFiles): Promise<{ root: TrustedRoot; refreshedAt: number } | null> => {
  const stored = await files.readJson<unknown>(TRUSTED_ROOT_FILE, null);
  if (!isRecord(stored) || typeof stored.refreshedAt !== 'number') return null;
  try {
    return { root: TrustedRoot.fromJSON(stored.root), refreshedAt: stored.refreshedAt };
  } catch {
    return null;
  }
};

export { readTrustedRootCache };
