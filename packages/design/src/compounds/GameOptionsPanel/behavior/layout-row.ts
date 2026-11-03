/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import type { LayoutRow } from './option-layout.type';
import { hintOf, isChangedValue } from '../../OptionControl';
import { rowControlOf } from './row-control';
import { splitTermFacts } from './term-facts';

const layoutRowOf = (def: OptionDef, values: Readonly<Record<string, OptionValue>>): LayoutRow => {
  const value = values[def.key] ?? def.default;
  const { description, facts } = splitTermFacts(def);
  return {
    key: def.key,
    def,
    label: def.displayName,
    description,
    facts,
    hint: hintOf(def),
    control: rowControlOf(def),
    value,
    defaultValue: def.default,
    changed: isChangedValue(value, def.default),
    advanced: def.visibility.length === 0,
  };
};

export { layoutRowOf };
