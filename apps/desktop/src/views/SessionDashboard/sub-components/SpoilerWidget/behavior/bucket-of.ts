/* @layer renderer-app @kind logic */
import { GROUP_ALL, ITEM_TYPE_LABEL, ITEM_TYPE_ORDER } from '../SpoilerWidget.constants';
import type { GroupBy, GroupTag, SpoilerEntry } from '../SpoilerWidget.type';
import { sphereLabelOf } from './sphere-label-of';

const bucketOf = (entry: SpoilerEntry, by: GroupBy): GroupTag => {
  const { placement, type, finderGame } = entry;
  switch (by) {
    case 'finder': return { label: placement.finder, rank: placement.finder };
    case 'receiver': return { label: placement.receiver, rank: placement.receiver };
    case 'game': return { label: finderGame, rank: finderGame };
    case 'sphere': return { label: sphereLabelOf(placement.sphere), rank: placement.sphere ?? Number.MAX_SAFE_INTEGER };
    case 'type': return { label: ITEM_TYPE_LABEL[type], rank: ITEM_TYPE_ORDER.indexOf(type) };
    case 'none': return { label: GROUP_ALL.none, rank: 0 };
  }
};

export { bucketOf };
