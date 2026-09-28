/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';

const isAdvanced = (def: OptionDef) => def.visibility.length === 0;

export { isAdvanced };
