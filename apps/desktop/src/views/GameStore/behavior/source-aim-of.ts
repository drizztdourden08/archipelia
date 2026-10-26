/* @layer renderer-app @kind logic */
import type { InstallFailure } from '@archipelia/model';
import type { GameRow } from '../GameStore.type';
import { requestOf } from './request-of';
import type { SourceAim } from './usePackageSource.type';

const sourceAimOf = (row: GameRow, need: InstallFailure | undefined): SourceAim | undefined => {
  const missing = need?.packages[0];
  if (!missing) return undefined;
  return { key: row.entry.apworld, title: row.entry.displayName, module: missing.name, linked: missing.githubUrl, request: requestOf(row) };
};

export { sourceAimOf };
