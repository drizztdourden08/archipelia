/* @layer renderer-app @kind logic */
import type { GameSchema, OptionValue } from '@archipelia/model';
import type { OptionLayout } from './option-layout.type';
import { layoutRowOf } from './layout-row';
import { matchesQuery } from './matches-query';
import { tabIdOf, tabIdsOf } from './tab-groups';

const optionLayoutOf = (schema: GameSchema, values: Readonly<Record<string, OptionValue>>, query = ''): OptionLayout => {
  const rows = schema.options.map((def) => layoutRowOf(def, values));
  const tabs = tabIdsOf(schema).map((id) => {
    const own = rows.filter((row) => tabIdOf(schema, row.def) === id);
    const shown = own.filter((row) => matchesQuery(row.def, query));
    return {
      id,
      label: id,
      changed: own.filter((row) => row.changed).length,
      basic: shown.filter((row) => !row.advanced),
      advanced: shown.filter((row) => row.advanced),
    };
  });
  return { tabs, changedRows: rows.filter((row) => row.changed) };
};

export { optionLayoutOf };
