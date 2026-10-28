/* @layer renderer-app @kind logic */
import type { InstallRequest, VersionChoice, VersionList } from '@archipelia/catalog';
import type { GameRow } from '../GameStore.type';
import { requestOf } from './request-of';

const versionRequest = (row: GameRow, list: VersionList, choice: VersionChoice): InstallRequest | undefined => {
  const { apworld } = row.entry;
  if (list.by === 'version') return { kind: 'index', apworld, version: choice.id };
  if (choice.id === list.latestId) return requestOf(row);
  return { kind: 'index', apworld, version: choice.version ?? choice.id, tag: choice.id };
};

export { versionRequest };
