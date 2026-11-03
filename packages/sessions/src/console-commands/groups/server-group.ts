/* @layer core @kind config */
import type { ConsoleCommand } from '../console-command.type';
import { commandLine } from '../format/command-line';
import { quoteArg } from '../format/quote-arg';
import { valueOf } from '../format/value-of';

const serverGroup: readonly ConsoleCommand[] = [
  {
    id: 'help',
    label: 'Help',
    icon: 'info',
    group: 'Server',
    description: 'List every console command with its arguments.',
    params: [],
    format: () => commandLine('help'),
  },
  {
    id: 'license',
    label: 'License',
    icon: 'file-text',
    group: 'Server',
    description: 'Show the Archipelago license text.',
    params: [],
    format: () => commandLine('license'),
  },
  {
    id: 'options',
    label: 'Show options',
    icon: 'sliders-horizontal',
    group: 'Server',
    description: 'List every server option and its current value. The output includes the passwords.',
    params: [],
    format: () => commandLine('options'),
  },
  {
    id: 'option',
    label: 'Set option',
    icon: 'settings',
    group: 'Server',
    description: 'Change a server option while the room runs, such as the hint cost or the release mode.',
    params: [
      { name: 'name', label: 'Option', kind: 'choice', source: 'options' },
      { name: 'value', label: 'Value', kind: 'text', placeholder: 'Number, mode, on or off' },
    ],
    format: (values) => commandLine('option', valueOf(values, 'name'), quoteArg(valueOf(values, 'value'))),
  },
  {
    id: 'save',
    label: 'Save',
    icon: 'hard-drive',
    group: 'Server',
    description: 'Write the current room state to the save file.',
    params: [],
    format: () => commandLine('save'),
  },
  {
    id: 'datastore',
    label: 'Data storage',
    icon: 'cpu',
    group: 'Server',
    description: 'Debug tool: list the writable data storage keys and the approximate size of their values.',
    params: [],
    format: () => commandLine('datastore'),
  },
  {
    id: 'exit',
    label: 'Shut down',
    icon: 'triangle-alert',
    group: 'Server',
    description: 'Shut the server down. Every player is disconnected.',
    confirm: true,
    params: [],
    format: () => commandLine('exit'),
  },
];

export { serverGroup };
