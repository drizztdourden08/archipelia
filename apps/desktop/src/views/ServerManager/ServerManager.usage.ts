/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Servers page: a ListDetail of the saved SSH servers beside the editor of the picked one, with test, trust, a SaveBar and remove.',
  useWhen: [
    'The Servers page of the Hosting group.',
  ],
  avoidWhen: [
    { case: 'The archipelago.gg owner id.', use: 'SettingsRow' },
    { case: 'Picking a saved server in a session.', use: 'ServerOptionsForm' },
  ],
  rules: [
    'Put each saved server in search while the page is open.',
    'Add server opens a create form at the top of the list for the label; the new server is a row marked Not saved yet until Save stores it.',
    'Picking another server, Back or Add server with unsaved edits asks in the bar over the editor first.',
    'The editor ends in a SaveBar: Save and Discard, and whether the server is saved.',
    'The key file is a PathInput: type it, drop it from the desktop or Browse with the file dialog of the app; Reveal shows it in its folder, and leaving the box marks it touched.',
    'Keep passwords and passphrases in the vault; the form holds them only while typed.',
    'Show each problem as the error of its field, once the field was left or Save was pressed; Save with a problem saves nothing.',
    'The game port takes the hosting range, 1024 to 65535, with the same message as the builder; the SSH port takes any port, so 22 works.',
    'Test a server before trusting its host key, and toast whether it is ready.',
    'Remove is a danger button that asks first and names what loses the server; the delete of a row asks in the row.',
  ],
  a11y: [
    'The server list is an ItemList: the rows are buttons, pressed while selected, with rename and delete on each row.',
    'The heading of the detail names the server.',
    'An error is an alert with one plain sentence; the raw error goes to the app log.',
    'A field problem is the error note of its field, so the control is marked invalid and described by it.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the saved servers'],
    rule: 'The machines that can host a session.',
  },
  example: `import { ServerManager } from '../ServerManager';

const ServerManagerSample = () => <ServerManager />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
