/* @layer client-kit @kind config */
import type { OptionType } from './option-schema.type';

const OPTION_TYPES: readonly OptionType[] = ['toggle', 'choice', 'range', 'text', 'dict', 'set', 'list'];

const UNROLLABLE_TYPES: readonly OptionType[] = ['text', 'dict', 'set', 'list'];

const NAME_LIST_TYPES: readonly OptionType[] = ['set', 'list'];

const ROLL_WORD = /^random$/i;

const AP_COMMON_OPTION_KEYS: readonly string[] = [
  'accessibility',
  'progression_balancing',
  'local_items',
  'non_local_items',
  'start_inventory',
  'start_inventory_from_pool',
  'start_hints',
  'start_location_hints',
  'exclude_locations',
  'priority_locations',
  'item_links',
  'plando_items',
  'plando_connections',
];

export { AP_COMMON_OPTION_KEYS, NAME_LIST_TYPES, OPTION_TYPES, ROLL_WORD, UNROLLABLE_TYPES };
