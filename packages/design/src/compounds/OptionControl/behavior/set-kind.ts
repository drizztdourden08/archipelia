/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { ControlKind } from './control-kind.type';
import { PICKER_MAX } from './set-kind.constants';

const setKind = (def: OptionDef): ControlKind => {
  if (!def.validKeys?.length) return 'tags';
  return def.validKeys.length <= PICKER_MAX ? 'set-picker' : 'set-tags';
};

export { setKind };
