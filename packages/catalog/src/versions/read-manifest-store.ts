/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { DataFiles } from '@archipelia/model';
import { RELEASE_MANIFESTS_FILE } from './versions.constants';
import type { ManifestRecord, ManifestStore } from './versions.type';

const isRecordEntry = (value: unknown): value is ManifestRecord => isRecord(value) && (value.manifest === null || isRecord(value.manifest));

const readManifestStore = async (files: DataFiles): Promise<ManifestStore> => {
  const stored = await files.readJson<unknown>(RELEASE_MANIFESTS_FILE, null).catch(() => null);
  if (!isRecord(stored)) return {};
  return Object.fromEntries(Object.entries(stored).filter((pair): pair is [string, ManifestRecord] => isRecordEntry(pair[1])));
};

export { readManifestStore };
