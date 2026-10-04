/* @layer tests @kind test */
import { optionDef } from '@archipelia/model';
import type { OptionDef } from '@archipelia/model';

const DEFS: Record<string, OptionDef> = {
  bosses: optionDef({ key: 'bosses', group: 'Items', kind: 'dict', default: { Moldorm: 'Helmasaur' }, visibility: [] }),
  crystals: optionDef({ key: 'crystals', displayName: 'Crystals', kind: 'range', default: 7, range: { min: 0, max: 7 } }),
  death_link: optionDef({ key: 'death_link', displayName: 'Death link', kind: 'toggle', default: false }),
  exclude: optionDef({ key: 'exclude', group: 'Items', kind: 'set', default: [], validKeys: ['Bow', 'Hookshot'] }),
  goal: optionDef({
    key: 'goal',
    displayName: 'Goal',
    kind: 'choice',
    default: 'ganon',
    choices: [{ value: 'ganon', label: 'ganon' }, { value: 'crystals_only', label: 'crystals only' }],
  }),
  pieces: optionDef({ key: 'pieces', kind: 'named-range', default: 30, range: { min: 1, max: 90 }, namedValues: { easy: 20, normal: 30 } }),
  plando: optionDef({ key: 'plando', group: 'Items', kind: 'list', default: [], visibility: [] }),
  seed_name: optionDef({ key: 'seed_name', kind: 'text', default: '' }),
  start_inventory: optionDef({ key: 'start_inventory', group: 'Items', kind: 'counter', default: {}, validKeys: ['Arrows', 'Bombs'] }),
};

const defOf = (key: string): OptionDef => {
  const found = DEFS[key];
  if (!found) throw new Error(`no option ${key}`);
  return found;
};

export { defOf };
