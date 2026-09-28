/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { FieldDescriptor } from '@drizztdourden08/tessera/data';
import { FIELD_KIND } from './option-descriptor.constants';

const elementOf = (def: OptionDef): FieldDescriptor | undefined => {
  if (def.kind === 'list') return { path: `${def.key}[]`, label: def.displayName, kind: 'unknown', optional: false };
  if (def.kind !== 'set') return undefined;
  return def.validKeys?.length
    ? { path: `${def.key}[]`, label: def.displayName, kind: 'enum', optional: false, options: def.validKeys }
    : { path: `${def.key}[]`, label: def.displayName, kind: 'string', optional: false };
};

const optionDescriptor = (def: OptionDef): FieldDescriptor => ({
  path: def.key,
  label: def.displayName,
  kind: FIELD_KIND[def.kind],
  optional: false,
  group: def.group,
  hidden: def.visibility.length === 0,
  ...(def.kind === 'choice' ? { options: (def.choices ?? []).map((choice) => choice.value) } : {}),
  ...(elementOf(def) ? { of: elementOf(def) } : {}),
});

export { optionDescriptor };
