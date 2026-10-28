/* @layer renderer-app @kind logic */
import type { GameCardAction } from '@archipelia/design';
import type { CardHandlers, GameRow, VersionPick } from '../GameStore.type';
import { needOf } from './need-of';
import { removeKey } from './remove-key';
import { requestOf } from './request-of';

const installLabel = ({ state, installed }: GameRow, installing: boolean, pick?: VersionPick) => {
  if (pick ? pick.update : state === 'update') return installing ? 'Updating...' : 'Update';
  if (pick && installed) return installing ? 'Installing...' : 'Install this version';
  return installing ? 'Adding...' : 'Add';
};

const installAction = (row: GameRow, handlers: CardHandlers, pick?: VersionPick): GameCardAction[] => {
  const request = pick?.request ?? requestOf(row);
  const wanted = pick ? !pick.same : row.state !== 'installed';
  if (!request || !wanted) return [];
  const installing = handlers.isBusy(row.entry.apworld);
  const working = installing || handlers.isBusy(removeKey(row.entry.apworld));
  const blocked = !pick && Boolean(row.entry.unavailable);
  return [{
    id: 'install',
    label: installLabel(row, installing, pick),
    icon: 'download',
    primary: !needOf(row, handlers),
    disabled: working || blocked,
    loading: installing,
    onClick: () => handlers.installWorld(request, row.entry.apworld),
  }];
};

export { installAction };
