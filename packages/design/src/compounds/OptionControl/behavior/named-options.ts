/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { LabeledOption } from './choice-options.type';
import { titleCase } from './title-case';
import { CUSTOM_NUMBER } from './choice-options.constants';

const namedOptions = (def: OptionDef): LabeledOption[] => [
  ...Object.entries(def.namedValues ?? {}).map(([name, count]) => ({ value: name, label: `${titleCase(name)} (${count})` })),
  { value: CUSTOM_NUMBER, label: 'Custom number' },
];

export { namedOptions };
