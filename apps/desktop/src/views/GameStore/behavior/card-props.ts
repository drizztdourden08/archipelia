/* @layer renderer-app @kind logic */
import type { CardHandlers, GameRow } from '../GameStore.type';
import type { InstallRequest } from '@archipelia/catalog';
import type { GameCardAction, GameCardNote, GameCardProps, GameCardStatus } from '@archipelia/design';
import { KIND_LABEL, KIND_OF, NO_RELEASE } from '../GameStore.constants';
import { removeKey } from './remove-key';

const requestOf = ({ entry, latest }: GameRow): InstallRequest | undefined => {
  if (entry.source === 'official') return { kind: 'official', apworld: entry.apworld };
  return latest ? { kind: 'index', apworld: entry.apworld, version: latest.version } : undefined;
};

const statusOf = ({ state, entry }: GameRow): GameCardStatus | undefined => {
  if (entry.unavailable) return entry.unavailable === NO_RELEASE ? 'no-release' : 'unavailable';
  return state === 'update' ? 'update' : undefined;
};

const versionOf = ({ installed, latest, entry, state }: GameRow) => {
  if (entry.source === 'official') return latest?.version;
  if (installed && state === 'update' && latest) return `${installed.version} to ${latest.version}`;
  if (installed) return installed.version;
  return latest?.version ?? entry.firstParty?.worldVersion;
};

const rangeNote = ({ entry }: GameRow): GameCardNote[] => {
  const { minimumAp, maximumAp } = entry.firstParty ?? {};
  if (minimumAp && maximumAp) return [{ icon: 'info', text: `Archipelago ${minimumAp} to ${maximumAp}` }];
  return minimumAp ? [{ icon: 'info', text: `Archipelago ${minimumAp} or newer` }] : [];
};

const reasonNote = ({ entry }: GameRow): GameCardNote[] =>
  (entry.unavailable && entry.unavailable !== NO_RELEASE ? [{ icon: 'circle-alert', text: entry.unavailable, warning: true }] : []);

const trustNote = ({ installed }: GameRow): GameCardNote[] => {
  if (!installed?.trust) return [];
  const verified = installed.trust.state === 'verified';
  return [{ icon: verified ? 'lock' : 'triangle-alert', text: installed.trust.detail, warning: !verified }];
};

const checksumNote = ({ entry, latest }: GameRow): GameCardNote[] =>
  (latest && !latest.sha256 && entry.source === 'index' ? [{ icon: 'triangle-alert', text: 'No published checksum', warning: true }] : []);

const notesOf = (row: GameRow) => [...reasonNote(row), ...trustNote(row), ...checksumNote(row), ...rangeNote(row)];

const installLabel = ({ state }: GameRow, installing: boolean) => {
  if (state === 'update') return installing ? 'Updating...' : 'Update';
  return installing ? 'Adding...' : 'Add';
};

const actionsOf = (row: GameRow, { isBusy, installWorld, remove, openHome }: CardHandlers): GameCardAction[] => {
  const request = requestOf(row);
  const installing = isBusy(row.entry.apworld);
  const working = installing || isBusy(removeKey(row.entry.apworld));
  const install: GameCardAction[] = request && row.state !== 'installed'
    ? [{ id: 'install', label: installLabel(row, installing), icon: 'download', primary: true, disabled: working || Boolean(row.entry.unavailable), loading: installing, onClick: () => installWorld(request, row.entry.apworld) }]
    : [];
  const removal: GameCardAction[] = row.installed ? [{ id: 'remove', label: 'Remove', icon: 'trash-2', disabled: working, onClick: () => remove(row) }] : [];
  const home: GameCardAction[] = row.entry.home ? [{ id: 'home', label: 'Home page', icon: 'external-link', onClick: () => openHome(row.entry.home ?? '') }] : [];
  return [...install, ...home, ...removal];
};

const cardPropsOf = (row: GameRow, handlers: CardHandlers): GameCardProps => ({
  title: row.entry.displayName,
  kind: KIND_OF[row.entry.source],
  kindLabel: KIND_LABEL[row.entry.source],
  version: versionOf(row),
  status: statusOf(row),
  notes: notesOf(row),
  tags: row.entry.tags,
  actions: actionsOf(row, handlers),
});

export { cardPropsOf };
