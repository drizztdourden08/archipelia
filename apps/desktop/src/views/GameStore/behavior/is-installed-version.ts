/* @layer renderer-app @kind logic */
import type { VersionChoice, VersionList } from '@archipelia/catalog';
import type { GameRow } from '../GameStore.type';

const isInstalledVersion = ({ installed }: GameRow, choice: VersionChoice, by: VersionList['by']): boolean => {
  if (!installed) return false;
  if (by === 'version') return installed.version === choice.id;
  return installed.release ? installed.release.tag === choice.id : choice.version === installed.version;
};

export { isInstalledVersion };
