/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { NamedStep } from '@drizztdourden08/tessera/primitives';
import { titleCase } from './title-case';

const rangeNames = (def: OptionDef): NamedStep[] => Object.entries(def.namedValues ?? {}).reduce<NamedStep[]>(
  (steps, [name, value]) => (steps.some((step) => step.value === value) ? steps : [...steps, { label: titleCase(name), value }]),
  [],
);

export { rangeNames };
