/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The generation and server options of a session: how the seed is made, where the room is hosted and the room rules.',
  useWhen: [
    'The options card of the session builder.',
    'Any editor of a saved session that sets its generator, host and server.',
  ],
  avoidWhen: [
    { case: 'The app wide defaults for new sessions.', use: 'SettingsSection' },
    { case: 'One game option of a player.', use: 'OptionFieldRow' },
  ],
  rules: [
    'Pass the session values and apply each patch to the draft; the form keeps no state.',
    'Pass the saved servers as serverOptions for the remote host choice.',
    'Keep the password out of the saved session: pass hasPassword and the typed text, and clear it through onClearPassword.',
  ],
  a11y: [
    'Each field has a visible label.',
    'The three parts are separated and titled, so a screen reader can move between them.',
  ],
  tree: {
    path: ['a value the user sets', 'how a session is generated and hosted'],
    rule: 'The generator, host and server fields of a session.',
  },
  example: `import type { GeneratorSettings, HostTarget, ServerSettings } from '@archipelia/model';
import { ServerOptionsForm } from '@archipelia/design';

const noop = () => {};

const ServerOptionsFormSample = ({ generator, server, host }: { generator: GeneratorSettings; server: ServerSettings; host: HostTarget }) => (
  <ServerOptionsForm
    generator={generator}
    server={server}
    host={host}
    serverOptions={[]}
    password=""
    hasPassword={false}
    onGenerator={noop}
    onServer={noop}
    onHostKind={noop}
    onPort={noop}
    onRemoteServer={noop}
    onPassword={noop}
    onClearPassword={noop}
  />
);
`,
  propsHash: 'd8ead16d555783c3',
} satisfies ComponentUsage;

export { usage };
