/* @layer core @kind config */
import type { ConsoleCommand, ConsoleParam } from '../console-command.type';
import { DEFAULT_COUNTDOWN_SECONDS, MAX_COUNTDOWN_SECONDS } from '../console-command.constants';
import { commandLine } from '../format/command-line';
import { valueOf } from '../format/value-of';
import { wholeNumber } from '../format/whole-number';

const playerParam: ConsoleParam = { name: 'player', label: 'Player', kind: 'choice', source: 'players' };

const roomGroup: readonly ConsoleCommand[] = [
  {
    id: 'release',
    label: 'Release',
    icon: 'send',
    group: 'Room',
    description: 'Send out the remaining items of a player to their intended recipients.',
    confirm: true,
    params: [playerParam],
    format: (values) => commandLine('release', valueOf(values, 'player')),
  },
  {
    id: 'collect',
    label: 'Collect',
    icon: 'download',
    group: 'Room',
    description: 'Send the remaining items from every other world to a player.',
    confirm: true,
    params: [playerParam],
    format: (values) => commandLine('collect', valueOf(values, 'player')),
  },
  {
    id: 'allow_release',
    label: 'Allow release',
    icon: 'circle-check',
    group: 'Room',
    description: 'Let a player use the !release command at any time.',
    params: [playerParam],
    format: (values) => commandLine('allow_release', valueOf(values, 'player')),
  },
  {
    id: 'forbid_release',
    label: 'Forbid release',
    icon: 'lock',
    group: 'Room',
    description: 'Make a player follow the server rules for the !release command.',
    params: [playerParam],
    format: (values) => commandLine('forbid_release', valueOf(values, 'player')),
  },
  {
    id: 'countdown',
    label: 'Countdown',
    icon: 'clock',
    group: 'Room',
    description: 'Start a countdown for every connected player, from 1 second up to 1 hour.',
    params: [{ name: 'seconds', label: 'Seconds', kind: 'number', min: 1, max: MAX_COUNTDOWN_SECONDS, optional: true, placeholder: String(DEFAULT_COUNTDOWN_SECONDS) }],
    format: (values) => commandLine('countdown', String(wholeNumber(values, 'seconds', MAX_COUNTDOWN_SECONDS, DEFAULT_COUNTDOWN_SECONDS))),
  },
];

export { roomGroup };
