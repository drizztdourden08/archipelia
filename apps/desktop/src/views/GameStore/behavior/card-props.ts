/* @layer renderer-app @kind logic */
import type { CardHandlers, GameRow } from '../GameStore.type';
import type { InstallRequest } from '@archipelia/catalog';
import type { GameCardProps } from '@archipelia/design';
import { FIRST_PARTY_TAG, NOT_AVAILABLE, SOURCE_LABEL } from '../GameStore.constants';
import { removeKey } from './remove-key';

const requestOf = ({ entry, latest }: GameRow): InstallRequest | undefined => {
  if (entry.source === 'official') return { kind: 'official', apworld: entry.apworld };
  return latest ? { kind: 'index', apworld: entry.apworld, version: latest.version } : undefined;
};

const statusOf = ({ state, latest, entry }: GameRow): GameCardProps['status'] => {
  if (state === 'installed') return { label: 'Installed', tone: 'success' };
  if (state === 'update') return { label: `Update ${latest?.version}`, tone: 'warning' };
  return entry.unavailable ? { label: NOT_AVAILABLE, tone: 'neutral' } : undefined;
};

const tagOf = (row: GameRow): string | undefined => {
  if (row.entry.source === 'first-party') return FIRST_PARTY_TAG;
  return statusOf(row) || row.entry.stability === 'unknown' ? undefined : row.entry.stability;
};

const versionLine = ({ installed, latest, entry }: GameRow) => {
  if (installed) return [`Installed ${installed.version}`];
  if (latest) return [`Latest ${latest.version}`];
  return entry.source === 'official' ? ['Ships with the engine'] : [];
};

const checksumWarning = ({ entry, latest }: GameRow) =>
  (latest && !latest.sha256 && entry.source === 'index' ? ['No published checksum'] : []);

const reasonLine = ({ entry }: GameRow) => (entry.unavailable ? [entry.unavailable] : []);

const trustLine = ({ installed }: GameRow) => (installed?.trust ? [installed.trust.detail] : []);

const detailsOf = (row: GameRow) => [...versionLine(row), ...reasonLine(row), ...trustLine(row), ...checksumWarning(row)];

const installLabel = ({ state }: GameRow, installing: boolean) => {
  if (state === 'update') return installing ? 'Updating...' : 'Update';
  return installing ? 'Adding...' : 'Add';
};

const cardPropsOf = (row: GameRow, { isBusy, installWorld, remove, openHome }: CardHandlers): GameCardProps => {
  const request = requestOf(row);
  const installing = isBusy(row.entry.apworld);
  const working = installing || isBusy(removeKey(row.entry.apworld));
  const install = request && row.state !== 'installed'
    ? [{ label: installLabel(row, installing), variant: 'primary', disabled: working || Boolean(row.entry.unavailable), loading: installing, onClick: () => installWorld(request, row.entry.apworld) }]
    : [];
  const removal = row.installed ? [{ label: 'Remove', variant: 'danger', disabled: working, onClick: () => remove(row) }] : [];
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
