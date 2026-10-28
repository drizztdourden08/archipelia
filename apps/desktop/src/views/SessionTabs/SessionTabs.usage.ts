/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The base screen: a strip of tabs, one per open session, with the lobby or the room of the active tab under it, or the idle state when no session is open.',
  useWhen: [
    'The base layer under every hub, drawn by the session screen.',
  ],
  avoidWhen: [
    { case: 'Past runs of a session.', use: 'History' },
    { case: 'The saved sessions and their setup.', use: 'Sessions' },
  ],
  rules: [
    'Keep the tabs and the active tab in the live store, fed by main; the strip only draws them.',
    'Label a tab with the name of its session and a status dot for its phase: Lobby, Generating, Hosting, Stopped or Failed.',
    'Closing a tab asks only when it would lose something: a joined player, a hosting room or a run being made. Stop keeps the tab with its results until it is closed.',
    'The tab context menu has Close and Close other tabs; the plus opens Sessions.',
    'When a profile starts with no tab open, open the Multiworld home over the idle state instead of leaving it in front.',
    'Publish the active tab to the widgets: the session widgets follow the active tab and name it.',
  ],
  a11y: [
    'The strip is a tablist named Open sessions; each tab says its phase to screen readers.',
    'Errors are alerts.',
    'The idle state names what to do next.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the sessions that are open, as tabs'],
    rule: 'The open sessions as tabs, over every hub.',
  },
  example: `import { SessionTabs } from '../SessionTabs';

const SessionTabsSample = () => <SessionTabs />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
