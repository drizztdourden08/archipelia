/* @layer renderer-app @kind logic */
import type { InstallRequest } from '@archipelia/catalog';
import type { GameRow } from '../GameStore.type';

const requestOf = ({ entry, latest }: GameRow): InstallRequest | undefined => {
  if (entry.source === 'official') return { kind: 'official', apworld: entry.apworld };
  return latest ? { kind: 'index', apworld: entry.apworld, version: latest.version } : undefined;
};

export { requestOf };
