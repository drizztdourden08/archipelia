/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { RowControl } from './option-layout.type';
import { CONTROL_OF } from './row-control.constants';

const rowControlOf = (def: OptionDef): RowControl => CONTROL_OF[def.kind](def);

export { rowControlOf };
