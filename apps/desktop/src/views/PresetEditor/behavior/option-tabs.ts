/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionFilter, OptionTab } from '../PresetEditor.type';
import { filterOptions } from './filter-options';
import { ALL_TAB } from '../PresetEditor.constants';

const optionTabs = (schema: GameSchema, filter: Omit<OptionFilter, 'tab'>): OptionTab[] => {
  const pool = filterOptions(schema.options, filter);
  return [
    ...schema.groups.map((group) => ({ id: group, label: group, count: pool.filter((def) => def.group === group).length })),
    { id: ALL_TAB, label: 'All', count: pool.length },
  ];
};

export { optionTabs };
