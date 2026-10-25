/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { OptionFilter } from '../PresetEditor.type';
import { ALL_TAB } from '../PresetEditor.constants';
import { isAdvanced } from './is-advanced';
import { matchesQuery } from './matches-query';

const jumpFilter = (def: OptionDef, filter: OptionFilter): OptionFilter => ({
  tab: filter.tab === ALL_TAB || filter.tab === def.group ? filter.tab : def.group,
  query: matchesQuery(def, filter.query.trim().toLowerCase()) ? filter.query : '',
  showAdvanced: filter.showAdvanced || isAdvanced(def),
});

export { jumpFilter };
