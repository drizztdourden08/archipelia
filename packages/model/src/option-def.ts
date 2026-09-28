/* @layer core @kind logic */
import type { OptionDefSeed } from './option-def.type';
import type { OptionDef } from './options.type';
import { DEFAULT_GROUP } from './option-def.constants';

const optionDef = (seed: OptionDefSeed): OptionDef => ({
  displayName: seed.key, group: DEFAULT_GROUP, description: '', visibility: ['simple', 'complex'], weightable: false, ...seed,
});

export { optionDef };
