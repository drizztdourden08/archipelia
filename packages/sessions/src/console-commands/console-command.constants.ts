/* @layer core @kind config */
import type { ConsoleGroup, ServerOption } from './console-command.type';

const CONSOLE_GROUPS: readonly ConsoleGroup[] = ['Players', 'Items and hints', 'Room', 'Server'];

const MAX_SEND_AMOUNT = 100;

const MAX_COUNTDOWN_SECONDS = 3600;

const DEFAULT_COUNTDOWN_SECONDS = 10;

const SERVER_OPTIONS: readonly ServerOption[] = [
  { name: 'hint_cost', kind: 'number' },
  { name: 'location_check_points', kind: 'number' },
  { name: 'server_password', kind: 'text' },
  { name: 'password', kind: 'text' },
  { name: 'release_mode', kind: 'choice', options: ['goal', 'enabled', 'disabled', 'auto', 'auto_enabled'] },
  { name: 'remaining_mode', kind: 'choice', options: ['goal', 'enabled', 'disabled'] },
  { name: 'collect_mode', kind: 'choice', options: ['goal', 'enabled', 'disabled', 'auto', 'auto_enabled'] },
  { name: 'countdown_mode', kind: 'choice', options: ['enabled', 'disabled', 'auto'] },
  { name: 'item_cheat', kind: 'boolean' },
  { name: 'compatibility', kind: 'number' },
];

export { CONSOLE_GROUPS, DEFAULT_COUNTDOWN_SECONDS, MAX_COUNTDOWN_SECONDS, MAX_SEND_AMOUNT, SERVER_OPTIONS };
