/* @layer renderer-app @kind logic */
import type { FieldDescriptor } from '@drizztdourden08/tessera/data';
import { ITEM_ENUM_LIMIT } from '../SpoilerWidget.constants';
import type { SpoilerEntry } from '../SpoilerWidget.type';
import { choiceField } from './choice-field';

const fieldsOf = (entries: readonly SpoilerEntry[]): FieldDescriptor[] => {
  const values = (path: string) => entries.map(({ record }) => record[path] ?? '');
  const items = new Set(values('item'));
  const item: FieldDescriptor = items.size <= ITEM_ENUM_LIMIT
    ? choiceField('item', 'Item', items)
    : { path: 'item', label: 'Item', kind: 'string', optional: false };
  return [
    choiceField('game', 'Game', values('game')),
    choiceField('finder', 'Finding slot', values('finder')),
    choiceField('receiver', 'Receiving slot', values('receiver')),
    choiceField('receiverGame', 'Receiving game', values('receiverGame')),
    item,
    { path: 'location', label: 'Location', kind: 'string', optional: false },
    choiceField('sphere', 'Sphere', values('sphere')),
    choiceField('required', 'Required', values('required')),
    choiceField('type', 'Item type', values('type')),
    choiceField('world', 'World', values('world')),
  ];
};

export { fieldsOf };
