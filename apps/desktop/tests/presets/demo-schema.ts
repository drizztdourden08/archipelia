/* @layer tests @kind test */
import { optionDef as option } from '@archipelia/model';
import type { GameSchema } from '@archipelia/model';

const CHOICES = [{ value: 'ganon', label: 'ganon' }, { value: 'crystals_only', label: 'crystals only' }];

const DEMO: GameSchema = {
  game: 'Demo',
  worldVersion: '1.2.0',
  groups: ['Game Options', 'Items'],
  presets: { Fast: { crystals: 3, death_link: 'true', removed: 1 } },
  options: [
    option({ key: 'death_link', displayName: 'Death link', kind: 'toggle', default: false }),
    option({ key: 'goal', displayName: 'Goal', kind: 'choice', default: 'ganon', choices: CHOICES }),
    option({ key: 'crystals', displayName: 'Crystals', kind: 'range', default: 7, range: { min: 0, max: 7 } }),
    option({ key: 'pieces', kind: 'named-range', default: 30, range: { min: 1, max: 90 }, namedValues: { easy: 20, normal: 30 } }),
    option({ key: 'seed_name', kind: 'text', default: '' }),
    option({ key: 'start_inventory', group: 'Items', kind: 'counter', default: {}, validKeys: ['Arrows', 'Bombs'] }),
    option({ key: 'exclude', group: 'Items', kind: 'set', default: [], validKeys: ['Bow', 'Hookshot'] }),
    option({ key: 'plando', group: 'Items', kind: 'list', default: [], visibility: [] }),
    option({ key: 'bosses', group: 'Items', kind: 'dict', default: { Moldorm: 'Helmasaur' }, visibility: [] }),
  ],
};

const defOf = (key: string) => {
  const found = DEMO.options.find((def) => def.key === key);
  if (!found) throw new Error(`no option ${key}`);
  return found;
};

export { defOf, DEMO };
