/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionFilter, OptionTab } from '../PresetEditor.type';
import { filterOptions } from './filter-options';
import { ALL_TAB } from '../PresetEditor.constants';

const optionTabs = (schema: GameSchema, filter: Omit<OptionFilter, 'tab'>, changed: ReadonlySet<string> = new Set()): OptionTab[] => {
  const pool = filterOptions(schema.options, filter);
  const changedIn = (group?: string) => schema.options.filter((def) => changed.has(def.key) && (group === undefined || def.group === group)).length;
  return [
    ...schema.groups.map((group) => ({ id: group, label: group, count: pool.filter((def) => def.group === group).length, changed: changedIn(group) })),
    { id: ALL_TAB, label: 'All', count: pool.length, changed: changedIn() },
  ];
};

export { optionTabs };
