/* @layer renderer-app @kind logic */
import type { CardHandlers, GameRow } from '../GameStore.type';
import type { GameCardAction, GameCardNote, GameCardProps, GameCardStatus } from '@archipelia/design';
import { DISCOVERED_LABEL, KIND_LABEL, KIND_OF, NO_RELEASE } from '../GameStore.constants';
import { busyOf } from './busy-of';
import { failureOf } from './failure-of';
import { isVerified } from './is-verified';
import { needOf } from './need-of';
import { removeKey } from './remove-key';
import { requestOf } from './request-of';
import { reviewNotes } from './review-notes';

const statusOf = (row: GameRow, handlers: CardHandlers): GameCardStatus | undefined => {
  const { state, entry } = row;
  const busy = busyOf(row, handlers);
  if (busy) return busy;
  if (needOf(row, handlers)) return 'needs-package';
  if (failureOf(row, handlers)) return 'failed';
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

const notesOf = (row: GameRow) => [...reasonNote(row), ...reviewNotes(row), ...trustNote(row), ...checksumNote(row), ...rangeNote(row)];

const installLabel = ({ state }: GameRow, installing: boolean) => {
  if (state === 'update') return installing ? 'Updating...' : 'Update';
  return installing ? 'Adding...' : 'Add';
};

const actionsOf = (row: GameRow, handlers: CardHandlers): GameCardAction[] => {
  const { isBusy, installWorld, remove, openHome, getPackage } = handlers;
  const needsPackage = Boolean(needOf(row, handlers));
  const request = requestOf(row);
  const installing = isBusy(row.entry.apworld);
  const removing = isBusy(removeKey(row.entry.apworld));
  const working = installing || removing;
  const install: GameCardAction[] = request && row.state !== 'installed'
    ? [{ id: 'install', label: installLabel(row, installing), icon: 'download', primary: !needsPackage, disabled: working || Boolean(row.entry.unavailable), loading: installing, onClick: () => installWorld(request, row.entry.apworld) }]
    : [];
  const removal: GameCardAction[] = row.installed ? [{ id: 'remove', label: removing ? 'Removing...' : 'Remove', icon: 'trash-2', tone: 'danger', disabled: working, loading: removing, onClick: () => remove(row) }] : [];
  const home: GameCardAction[] = row.entry.home ? [{ id: 'home', label: 'Home page', icon: 'external-link', disabled: working, onClick: () => openHome(row.entry.home ?? '') }] : [];
  const getIt: GameCardAction[] = needsPackage
    ? [{ id: 'get-package', label: 'Get this package', icon: 'package', primary: true, disabled: working, onClick: () => getPackage(row) }]
    : [];
  return [...getIt, ...install, ...home, ...removal];
};

const cardPropsOf = (row: GameRow, handlers: CardHandlers): GameCardProps => ({
  title: row.entry.displayName,
  kind: KIND_OF[row.entry.source],
  kindLabel: row.entry.discovered ? DISCOVERED_LABEL : KIND_LABEL[row.entry.source],
  verified: isVerified(row),
  version: versionOf(row),
  status: statusOf(row, handlers),
  notes: notesOf(row),
  tags: row.entry.tags,
  actions: actionsOf(row, handlers),
  onOpen: () => handlers.open(row),
});

export { cardPropsOf };
