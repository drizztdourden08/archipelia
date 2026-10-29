/* @layer renderer-app @kind logic */
import type { CardHandlers, GameRow, VersionPick } from '../GameStore.type';
import type { GameCardAction, GameCardNote, GameCardProps, GameCardStatus } from '@archipelia/design';
import { joinsDirectly } from '@archipelia/model';
import { DISCOVERED_LABEL, KIND_LABEL, KIND_OF, NO_RELEASE } from '../GameStore.constants';
import { busyOf } from './busy-of';
import { failureOf } from './failure-of';
import { isPrerelease } from './is-prerelease';
import { isVerified } from './is-verified';
import { needOf } from './need-of';
import { removeKey } from './remove-key';
import { installAction } from './install-action';
import { installedLabel } from './release-label';
import { reviewNotes } from './review-notes';
import { worldVersionOf } from './world-version-of';

const statusOf = (row: GameRow, handlers: CardHandlers, pick?: VersionPick): GameCardStatus | undefined => {
  const { state, entry } = row;
  const busy = busyOf(row, handlers);
  if (busy) return busy;
  if (needOf(row, handlers)) return 'needs-package';
  if (failureOf(row, handlers)) return 'failed';
  if (entry.unavailable && !pick) return entry.unavailable === NO_RELEASE ? 'no-release' : 'unavailable';
  return state === 'update' ? 'update' : undefined;
};

const latestLabel = ({ latest, entry }: GameRow): string | undefined => entry.firstParty?.appVersion ?? latest?.version ?? entry.firstParty?.worldVersion;

const versionOf = (row: GameRow) => {
  const { installed, latest, entry, state } = row;
  if (entry.source === 'official') return latest?.version;
  if (installed && state === 'update' && latest) return `${installedLabel(entry, installed)} to ${entry.firstParty?.appVersion ?? latest.version}`;
  if (installed) return installedLabel(entry, installed);
  return latestLabel(row);
};

const worldVersionNote = ({ entry }: GameRow): { worldVersion?: string } => {
  const world = entry.firstParty?.appVersion ? worldVersionOf(entry) : undefined;
  return world ? { worldVersion: world } : {};
};

const rangeNote = ({ entry }: GameRow): GameCardNote[] => {
  const { minimumAp, maximumAp } = entry.firstParty ?? {};
  if (minimumAp && maximumAp) return [{ icon: 'info', text: `Archipelago ${minimumAp} to ${maximumAp}` }];
  return minimumAp ? [{ icon: 'info', text: `Archipelago ${minimumAp} or newer` }] : [];
};

const reasonNote = ({ entry }: GameRow, pick?: VersionPick): GameCardNote[] =>
  (entry.unavailable && !pick && entry.unavailable !== NO_RELEASE ? [{ icon: 'circle-alert', text: entry.unavailable, warning: true }] : []);

const trustNote = ({ installed }: GameRow): GameCardNote[] => {
  if (!installed?.trust) return [];
  const verified = installed.trust.state === 'verified';
  return [{ icon: verified ? 'lock' : 'triangle-alert', text: installed.trust.detail, warning: !verified }];
};

const checksumNote = ({ entry, latest }: GameRow): GameCardNote[] =>
  (latest && !latest.sha256 && entry.source === 'index' ? [{ icon: 'triangle-alert', text: 'No published checksum', warning: true }] : []);

const notesOf = (row: GameRow, pick?: VersionPick) => [...reasonNote(row, pick), ...reviewNotes(row), ...trustNote(row), ...checksumNote(row), ...rangeNote(row)];

const actionsOf = (row: GameRow, handlers: CardHandlers, pick?: VersionPick): GameCardAction[] => {
  const { isBusy, remove, openHome, getPackage } = handlers;
  const needsPackage = Boolean(needOf(row, handlers));
  const removing = isBusy(removeKey(row.entry.apworld));
  const working = isBusy(row.entry.apworld) || removing;
  const removal: GameCardAction[] = row.installed ? [{ id: 'remove', label: removing ? 'Removing...' : 'Remove', icon: 'trash-2', tone: 'danger', disabled: working, loading: removing, onClick: () => remove(row) }] : [];
  const home: GameCardAction[] = row.entry.home ? [{ id: 'home', label: 'Home page', icon: 'external-link', disabled: working, onClick: () => openHome(row.entry.home ?? '') }] : [];
  const getIt: GameCardAction[] = needsPackage
    ? [{ id: 'get-package', label: 'Get this package', icon: 'package', primary: true, disabled: working, onClick: () => getPackage(row) }]
    : [];
  return [...getIt, ...installAction(row, handlers, pick), ...home, ...removal];
};

const cardPropsOf = (row: GameRow, handlers: CardHandlers, pick?: VersionPick): GameCardProps => ({
  title: row.entry.displayName,
  kind: KIND_OF[row.entry.source],
  kindLabel: row.entry.discovered ? DISCOVERED_LABEL : KIND_LABEL[row.entry.source],
  verified: isVerified(row),
  direct: joinsDirectly(row.entry),
  ...(isPrerelease(row) ? { prerelease: true } : {}),
  version: versionOf(row),
  ...worldVersionNote(row),
  status: statusOf(row, handlers, pick),
  notes: notesOf(row, pick),
  tags: row.entry.tags,
  actions: actionsOf(row, handlers, pick),
  onOpen: () => handlers.open(row),
});

export { cardPropsOf };
