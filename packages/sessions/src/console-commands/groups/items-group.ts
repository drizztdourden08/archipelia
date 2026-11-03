/* @layer core @kind config */
import type { ConsoleCommand, ConsoleParam, ConsoleValues } from '../console-command.type';
import { MAX_SEND_AMOUNT } from '../console-command.constants';
import { commandLine } from '../format/command-line';
import { quoteArg } from '../format/quote-arg';
import { valueOf } from '../format/value-of';
import { wholeNumber } from '../format/whole-number';

const playerParam: ConsoleParam = { name: 'player', label: 'Player', kind: 'choice', source: 'players' };

const itemParam: ConsoleParam = {
  name: 'item', label: 'Item', kind: 'choice', source: 'items', dependsOn: 'player', placeholder: 'Name or item id',
};

const locationParam: ConsoleParam = {
  name: 'location', label: 'Location', kind: 'choice', source: 'locations', dependsOn: 'player', placeholder: 'Name or location id',
};

const target = (values: ConsoleValues, thing: string): string[] => [quoteArg(valueOf(values, 'player')), quoteArg(valueOf(values, thing))];

const itemsGroup: readonly ConsoleCommand[] = [
  {
    id: 'send',
    label: 'Send item',
    icon: 'package',
    group: 'Items and hints',
    description: 'Send one item to a player, as a cheat.',
    params: [playerParam, itemParam],
    format: (values) => commandLine('send', ...target(values, 'item')),
  },
  {
    id: 'send_multiple',
    label: 'Send several items',
    icon: 'layers',
    group: 'Items and hints',
    description: 'Send several copies of one item to a player, up to 100.',
    params: [{ name: 'amount', label: 'Amount', kind: 'number', placeholder: `1 to ${MAX_SEND_AMOUNT}` }, playerParam, itemParam],
    format: (values) => commandLine('send_multiple', String(wholeNumber(values, 'amount', MAX_SEND_AMOUNT, 1)), ...target(values, 'item')),
  },
  {
    id: 'send_location',
    label: 'Send location',
    icon: 'compass',
    group: 'Items and hints',
    description: 'Send out the item at a player location as though the player had checked it.',
    params: [playerParam, locationParam],
    format: (values) => commandLine('send_location', ...target(values, 'location')),
  },
  {
    id: 'hint',
    label: 'Hint item',
    icon: 'sparkles',
    group: 'Items and hints',
    description: 'Send out a hint for a player item to their team. An item group name hints every item of the group.',
    params: [playerParam, itemParam],
    format: (values) => commandLine('hint', ...target(values, 'item')),
  },
  {
    id: 'hint_location',
    label: 'Hint location',
    icon: 'bookmark',
    group: 'Items and hints',
    description: 'Send out a hint for a player location to their team. A location group name hints every location of the group.',
    params: [playerParam, locationParam],
    format: (values) => commandLine('hint_location', ...target(values, 'location')),
  },
];

export { itemsGroup };
