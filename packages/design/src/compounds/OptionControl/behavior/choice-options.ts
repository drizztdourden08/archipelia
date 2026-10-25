/* @layer renderer-app @kind logic */
import { choicesOf } from '@archipelia/model';
import type { OptionDef } from '@archipelia/model';
import type { LabeledOption } from './choice-options.type';
import { titleCase } from './title-case';

const choiceOptions = (def: OptionDef): LabeledOption[] =>
  choicesOf(def).map((choice) => ({ value: choice.value, label: titleCase(choice.label) }));

export { choiceOptions };
