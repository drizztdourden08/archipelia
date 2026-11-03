/* @layer core @kind config */
import type { ConsoleCommand } from '../console-command.type';
import { commandLine } from '../format/command-line';
import { quoteArg } from '../format/quote-arg';
import { valueOf } from '../format/value-of';

const playersGroup: readonly ConsoleCommand[] = [
  {
    id: 'players',
    label: 'Connected players',
    icon: 'users',
    group: 'Players',
    description: 'List the players currently connected to the room.',
    params: [],
    format: () => commandLine('players'),
  },
  {
    id: 'status',
    label: 'Team status',
    icon: 'radio',
    group: 'Players',
    description: 'Show the status of each team, or only who has a given tag such as DeathLink or EnergyLink.',
    params: [{ name: 'tag', label: 'Tag', kind: 'text', optional: true, placeholder: 'DeathLink' }],
    format: (values) => commandLine('status', quoteArg(valueOf(values, 'tag'))),
  },
  {
    id: 'alias',
    label: 'Set alias',
    icon: 'pencil',
    group: 'Players',
    description: 'Give a player an alias of up to 15 characters. Leave the alias empty to remove it.',
    params: [
      { name: 'player', label: 'Player', kind: 'choice', source: 'players' },
      { name: 'alias', label: 'Alias', kind: 'text', optional: true, placeholder: 'Empty removes the alias' },
    ],
    format: (values) => commandLine('alias', valueOf(values, 'player'), valueOf(values, 'alias')),
  },
];

export { playersGroup };
