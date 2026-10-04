/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The bar over a hosted room: its status, name, address, room link, seed, uptime and stage, with widget toggles, copy and stop.',
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
    'Pass one widget entry per dock widget, with its visible state.',
    'Pass each fact as text ready to show; leave out the ones the room has not reported.',
  ],
  a11y: [
    'The status is a pill with text, read first.',
    'The copy button reads Copied once the address is on the clipboard.',
    'Each widget toggle says whether its widget is shown.',
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
    widgets={[{ id: 'log', label: 'Log', visible: true }]}
    onToggleWidget={noop}
    onResetLayout={noop}
    onCopy={noop}
    onStop={noop}
  />
);
`,
  propsHash: 'a5ef916aadd5990d',
} satisfies ComponentUsage;

export { usage };
