/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { OptionFilter } from '../PresetEditor.type';
import { isAdvanced } from './is-advanced';
import { matchesQuery } from './matches-query';

const filterOptions = (options: OptionDef[], { query, showAdvanced }: Omit<OptionFilter, 'tab'>) => {
  const needle = query.trim().toLowerCase();
  return options.filter((def) => (showAdvanced || !isAdvanced(def)) && matchesQuery(def, needle));
};

export { filterOptions };
