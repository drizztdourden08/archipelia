/* @layer renderer-app @kind logic */
import { compile, matchesText } from '@drizztdourden08/tessera/data';
import type { FieldDescriptor, FilterClause } from '@drizztdourden08/tessera/data';
import type { SpoilerEntry } from '../SpoilerWidget.type';

const filterEntries = (entries: readonly SpoilerEntry[], query: string, clauses: readonly FilterClause[], fields: readonly FieldDescriptor[]) => {
  const test = compile(clauses, fields);
  return entries.filter((entry) => matchesText(entry.text, query) && test(entry.record));
};

export { filterEntries };
