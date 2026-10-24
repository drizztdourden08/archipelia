/* @layer core @kind logic */
import type { GeneratorSettings } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { check } from './check-keys';
import { GENERATOR_KEYS, SPOILER_LEVELS } from './options.constants';
import { readChoice } from './read-choice';
import { readFlag } from './read-flag';

const readGenerator = (value: unknown, base: GeneratorSettings): GeneratorSettings => {
  if (!isRecord(value)) throw new Error('options.generator must be an object');
  check('options.generator', value, GENERATOR_KEYS);
  return {
    spoiler: value.spoiler === undefined ? base.spoiler : readChoice('options.generator.spoiler', value.spoiler, SPOILER_LEVELS),
    race: value.race === undefined ? base.race : readFlag('options.generator.race', value.race),
    progressionBalancing: value.progressionBalancing === undefined ? base.progressionBalancing : readFlag('options.generator.progressionBalancing', value.progressionBalancing),
  };
};

export { readGenerator };
