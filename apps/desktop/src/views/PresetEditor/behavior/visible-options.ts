/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionFilter } from '../PresetEditor.type';
import { filterOptions } from './filter-options';
import { ALL_TAB } from '../PresetEditor.constants';

const visibleOptions = (schema: GameSchema, filter: OptionFilter) =>
  filterOptions(schema.options, filter).filter((def) => filter.tab === ALL_TAB || def.group === filter.tab);

export { visibleOptions };
