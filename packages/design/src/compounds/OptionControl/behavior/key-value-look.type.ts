/* @layer renderer-app @kind types */
import type { KeyValueEntry, KeyValueKind } from '@drizztdourden08/tessera/composites';

type KeyValueLook = { valueKind: KeyValueKind; keys?: readonly string[]; min?: number; newValue: KeyValueEntry };

export type { KeyValueLook };
