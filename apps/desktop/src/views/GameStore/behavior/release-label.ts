/* @layer renderer-app @kind logic */
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { worldVersionOf } from './world-version-of';

const tagLabel = (tag: string): string => tag.replace(/^v(?=\d)/, '');

const installedLabel = (entry: CatalogEntry, installed: InstalledGame): string => {
  const app = entry.firstParty?.appVersion;
  if (!app) return installed.version;
  if (installed.release?.tag) return tagLabel(installed.release.tag);
  return installed.version === worldVersionOf(entry) ? app : installed.version;
};

export { installedLabel };
