/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { ScaleLabelEntry } from '@drizztdourden08/tessera/primitives';
import { titleCase } from './title-case';

const rangeNames = (def: OptionDef): ScaleLabelEntry[] => Object.entries(def.namedValues ?? {}).reduce<ScaleLabelEntry[]>(
  (steps, [name, value]) => (steps.some(([at]) => at === value) ? steps : [...steps, [value, titleCase(name)]]),
  [],
);

export { rangeNames };
