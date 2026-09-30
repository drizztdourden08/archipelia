/* @layer renderer-app @kind logic */
import type { CardHandlers, GameRow } from '../GameStore.type';
import type { InstallRequest } from '../../../ipc/contract.type';
import type { GameCardProps } from '../../../compounds/GameCard';
import { SOURCE_LABEL } from '../GameStore.constants';

const requestOf = ({ entry, latest }: GameRow): InstallRequest | undefined => {
  if (entry.source === 'official') return { kind: 'official', apworld: entry.apworld };
  return latest ? { kind: 'index', apworld: entry.apworld, version: latest.version } : undefined;
};

const statusOf = ({ state, latest }: GameRow): GameCardProps['status'] => {
  if (state === 'installed') return { label: 'Installed', tone: 'success' };
  return state === 'update' ? { label: `Update ${latest?.version}`, tone: 'warning' } : undefined;
};

const tagOf = (row: GameRow): string | undefined =>
  (statusOf(row) || row.entry.stability === 'unknown' ? undefined : row.entry.stability);

const versionLine = ({ installed, latest }: GameRow) => {
  if (installed) return `Installed ${installed.version}`;
  return latest ? `Latest ${latest.version}` : 'Ships with the engine';
};

const checksumWarning = ({ entry, latest }: GameRow) =>
  (latest && !latest.sha256 && entry.source === 'index' ? ['No published checksum'] : []);

const detailsOf = (row: GameRow) => [versionLine(row), ...checksumWarning(row)];

const cardPropsOf = (row: GameRow, { busy, installWorld, remove, openHome }: CardHandlers): GameCardProps => {
  const request = requestOf(row);
  const working = busy === row.entry.apworld;
  const install = request && row.state !== 'installed'
    ? [{ label: row.state === 'update' ? 'Update' : 'Add', primary: true, disabled: working, onClick: () => installWorld(request, row.entry.apworld) }]
    : [];
  const removal = row.installed ? [{ label: 'Remove', disabled: working, onClick: () => remove(row.entry.apworld) }] : [];
  const home = row.entry.home ? [{ label: 'Home page', onClick: () => openHome(row.entry.home ?? '') }] : [];
  return {
    title: row.entry.displayName,
    source: SOURCE_LABEL[row.entry.source],
    status: statusOf(row),
    tag: tagOf(row),
    details: detailsOf(row),
    actions: [...install, ...removal, ...home],
  };
};

export { cardPropsOf };
