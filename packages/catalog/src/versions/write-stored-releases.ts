/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import { readStoredReleases } from './read-stored-releases';
import { MAX_STORED_REPOS, RELEASES_FILE } from './versions.constants';
import type { StoredReleases } from './versions.type';

const writeStoredReleases = async (files: DataFiles, key: string, next: StoredReleases): Promise<void> => {
  const all = { ...(await readStoredReleases(files)), [key]: next };
  const newest = Object.entries(all).sort((a, b) => b[1].fetchedAt - a[1].fetchedAt).slice(0, MAX_STORED_REPOS);
  await files.writeJson(RELEASES_FILE, Object.fromEntries(newest)).catch(() => undefined);
};

export { writeStoredReleases };
