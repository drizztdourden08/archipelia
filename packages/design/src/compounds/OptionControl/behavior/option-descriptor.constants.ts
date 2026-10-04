/* @layer renderer-app @kind config */
import type { OptionKind } from '@archipelia/model';
import type { FieldKind } from '@drizztdourden08/tessera/data';

const FIELD_KIND: Record<OptionKind, FieldKind> = {
  toggle: 'boolean',
  choice: 'enum',
  range: 'number',
  'named-range': 'number',
  text: 'string',
  set: 'array',
  list: 'array',
  counter: 'object',
  dict: 'object',
};

export { FIELD_KIND };
