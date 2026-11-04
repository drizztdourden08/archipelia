/* @layer renderer-app @kind logic */
import type { SpoilerRowData } from '@archipelia/design';
import { ITEM_TONE, ITEM_TYPE_LABEL } from '../SpoilerWidget.constants';
import type { SpoilerEntry } from '../SpoilerWidget.type';
import { restOf } from './rest-of';

const rowOf = (entry: SpoilerEntry, trimArea: string | null): SpoilerRowData => {
  const { placement, type, finderGame, receiverGame } = entry;
  const { id, location, item, finder, receiver, sphere } = placement;
  return {
    id: String(id),
    primary: restOf(location, trimArea),
    secondary: item,
    mark: { tone: ITEM_TONE[type], label: ITEM_TYPE_LABEL[type] },
    receiver: finder === receiver ? undefined : receiver,
    sphere,
    detail: `${location}. Found by ${finder} (${finderGame}), received by ${receiver} (${receiverGame}).`,
  };
};

export { rowOf };
