/* @layer electron-main @kind logic */
import { SPOILER_LEVELS } from '@archipelia/model';
import type { GeneratorSettings } from '@archipelia/model';
import { GENERATOR_OVERRIDE_KEYS } from '../live.constants';
import { readChoice } from './read-choice';
import { readFlag } from './read-flag';
import { readRecord } from './read-record';

const generatorReaders = {
  spoiler: (value: unknown) => readChoice('generator.spoiler', value, SPOILER_LEVELS),
  race: (value: unknown) => readFlag('generator.race', value),
  progressionBalancing: (value: unknown) => readFlag('generator.progressionBalancing', value),
};

const readGeneratorOverrides = (value: unknown): Partial<GeneratorSettings> => {
  const given = readRecord('generator', value, GENERATOR_OVERRIDE_KEYS);
  return Object.fromEntries(GENERATOR_OVERRIDE_KEYS.filter((key) => key in given).map((key) => [key, generatorReaders[key](given[key])]));
};

export { readGeneratorOverrides };
