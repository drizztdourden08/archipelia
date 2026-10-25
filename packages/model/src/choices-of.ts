/* @layer core @kind logic */
import type { OptionChoice, OptionDef } from './options.type';
import { RANDOM_CHOICE } from './choices-of.constants';

const choicesOf = (def: OptionDef): OptionChoice[] => {
  const listed = def.choices ?? [];
  return listed.some((choice) => choice.value === RANDOM_CHOICE.value) ? listed : [...listed, RANDOM_CHOICE];
};

export { choicesOf };
