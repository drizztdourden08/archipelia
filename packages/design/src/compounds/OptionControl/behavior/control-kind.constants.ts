/* @layer renderer-app @kind config */
import { isStringList } from '@archipelia/model';
import type { OptionDef, OptionKind, OptionValue } from '@archipelia/model';
import type { ControlKind } from './control-kind.type';
import { setKind } from './set-kind';

const CONTROL_OF: Record<OptionKind, (def: OptionDef, value: OptionValue) => ControlKind> = {
  toggle: () => 'toggle',
  choice: () => 'choice',
  range: () => 'range',
  'named-range': (def) => (Object.keys(def.namedValues ?? {}).length ? 'named-range' : 'range'),
  text: () => 'text',
  set: setKind,
  list: (def, value) => (isStringList(value) && isStringList(def.default) ? 'tags' : 'json-list'),
  counter: () => 'counter',
  dict: () => 'json-object',
};

export { CONTROL_OF };
