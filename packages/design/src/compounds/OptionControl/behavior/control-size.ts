/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { ControlKind } from './control-kind.type';
import type { ControlSize } from './control-size.type';
import { SIZE_OF } from './control-size.constants';

const controlSizeOf = (def: OptionDef, kind: ControlKind): ControlSize => SIZE_OF[kind](def);

export { controlSizeOf };
