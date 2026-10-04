/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { LabeledOption } from './choice-options.type';
import { titleCase } from './title-case';

const choiceOptions = (def: OptionDef): LabeledOption[] =>
  (def.choices ?? []).map((choice) => ({ value: choice.value, label: titleCase(choice.label) }));

export { choiceOptions };
