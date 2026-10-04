/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import type { ControlKind } from './control-kind.type';
import { CONTROL_OF } from './control-kind.constants';

const controlKindOf = (def: OptionDef, value: OptionValue): ControlKind => CONTROL_OF[def.kind](def, value);

export { controlKindOf };
