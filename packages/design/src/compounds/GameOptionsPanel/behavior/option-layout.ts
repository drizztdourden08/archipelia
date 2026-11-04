/* @layer renderer-app @kind logic */
import type { GameSchema, OptionValue } from '@archipelia/model';
import type { LayoutTab, OptionLayout } from './option-layout.type';
import { layoutRowOf } from './layout-row';
import { matchesQuery } from './matches-query';
import { tabIdOf } from './tab-id-of';
import { tabIdsOf } from './tab-ids-of';

const optionLayoutOf = (schema: GameSchema, values: Readonly<Record<string, OptionValue>>, query = ''): OptionLayout => {
  const rows = schema.options.map((def) => layoutRowOf(def, values));
  const tabOf = (id: string): LayoutTab => {
    const own = rows.filter((row) => tabIdOf(schema, row.def) === id);
    const shown = own.filter((row) => matchesQuery(row.def, query));
    return {
      id,
      label: id,
      changed: own.filter((row) => row.changed).length,
      basic: shown.filter((row) => !row.advanced),
      advanced: shown.filter((row) => row.advanced),
    };
  };
  const [firstId, ...otherIds] = tabIdsOf(schema);
  const tabs: OptionLayout['tabs'] = [tabOf(firstId), ...otherIds.map(tabOf)];
  return { tabs, changedRows: rows.filter((row) => row.changed) };
};

export { optionLayoutOf };
