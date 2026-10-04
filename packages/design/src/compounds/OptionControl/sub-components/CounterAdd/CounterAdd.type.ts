/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type CounterAddProps = { def: OptionDef; value: OptionValue; onAdd: (name: string) => void; disabled?: boolean };

export type { CounterAddProps };
