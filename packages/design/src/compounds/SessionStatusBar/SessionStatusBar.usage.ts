/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The bar over a hosted room: its status, name, address, room link, seed, uptime and stage, with reset layout, copy and stop.',
  useWhen: [
    'The top of the session dashboard while a session runs or hosts.',
    'Any view of one running room that needs its address and a stop button.',
  ],
  avoidWhen: [
    { case: 'The title bar of the window.', use: 'WindowTitleBar' },
    { case: 'Facts about a record under headings.', use: 'FactsPanel' },
  ],
  rules: [
    'Pass address as null until the room listens; copy turns off on its own.',
    'Set stoppable only while the run can be stopped.',
    'Reset layout puts the session widgets back where they start; the Widgets menu shows and hides each one.',
    'Pass each fact as text ready to show; leave out the ones the room has not reported.',
  ],
  a11y: [
    'The status is a pill with text, read first.',
    'The copy button reads Copied once the address is on the clipboard.',
  ],
  tree: {
    path: ['layout', 'window chrome', 'the bar of a hosted room'],
    rule: 'The status line and actions of a running room.',
  },
  example: `import { SessionStatusBar } from '@archipelia/design';

const noop = () => {};

const SessionStatusBarSample = () => (
  <SessionStatusBar
    status="hosting"
    statusTone="success"
    name="Friday run"
    host="This computer"
    address="localhost:38281"
    uptime="12 min"
    progress={null}
    copied={false}
    stoppable
    onResetLayout={noop}
    onCopy={noop}
    onStop={noop}
  />
);
`,
  propsHash: 'a827bb1f72cc4b0e',
} satisfies ComponentUsage;

export { usage };
