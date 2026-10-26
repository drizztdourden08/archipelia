/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The world settings of a session in two settings sections: how the seed is made and the server rules of the room.',
  useWhen: [
    'The world settings column of the session builder.',
    'Any editor of a saved session that sets its generator and server rules.',
  ],
  avoidWhen: [
    { case: 'The app wide defaults for new sessions.', use: 'SettingsSection' },
    { case: 'One game option of a player.', use: 'OptionFieldRow' },
  ],
  rules: [
    'Pass the session values and apply each patch to the draft; the form keeps no state.',
    'The rows use the same inputs, descriptions and hints as the Hosting settings page, from SERVER_TEXT, so a rule reads the same in both places.',
    'Keep the host, the port and the room password out of this form: they belong with how players join the session.',
  ],
  a11y: [
    'Each row has a visible title and a description, and its control is named after the title.',
    'The two parts are titled settings sections, so a screen reader can move between them.',
  ],
  tree: {
    path: ['a value the user sets', 'how a session is generated and hosted'],
    rule: 'The generator and server rules of a session.',
  },
  example: `import type { GeneratorSettings, ServerSettings } from '@archipelia/model';
import { ServerOptionsForm } from '@archipelia/design';

const noop = () => {};

const ServerOptionsFormSample = ({ generator, server }: { generator: GeneratorSettings; server: ServerSettings }) => (
  <ServerOptionsForm generator={generator} server={server} onGenerator={noop} onServer={noop} />
);
`,
  propsHash: 'adad9dbd47c15ea2',
} satisfies ComponentUsage;

export { usage };
