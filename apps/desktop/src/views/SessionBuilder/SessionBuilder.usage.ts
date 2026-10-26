/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The setup page of a session: its name, where the room runs, whether the lobby takes direct connections and how, the room password, and the world settings. Nothing runs here.',
  useWhen: [
    'The New session and Edit session sub-pages of the Sessions page.',
  ],
  avoidWhen: [
    { case: 'The players, the lobby, the addresses and Run of a started session.', use: 'SessionLobby' },
    { case: 'The list of sessions and runs.', use: 'SessionsLibrary' },
    { case: 'The options of one preset.', use: 'PresetEditor' },
  ],
  rules: [
    'Pass no templateId for a new session, or the id of the saved one to edit; the page loads it and says when it is gone.',
    'Hold configuration only: no player, no lobby, no address, no status and no Run.',
    'The header actions are Save and Start session; Start session saves, opens the lobby whatever the session type, and goes to the lobby screen. It is off with the first setup problem as its reason.',
    'Where (Local, LAN, Remote) sets where the room runs and who can reach it, on its own. Allow direct connections never changes Where, and Where never changes it.',
    'Choosing LAN opens nothing; Start session asks once before it opens a network port.',
    'Direct connections follow Where: this computer for Local, the network for LAN, the Archipelia server for Remote. archipelago.gg and SSH say inline why they do not take direct connections.',
    'While the lobby of the session is open, Where and Allow direct connections are locked with the reason, and a callout says the session is running its lobby.',
    'Lay it out in two columns once the width allows, with a Grid and a minimum column width: How players join on the left, the world settings on the right; one column in that order when narrow.',
    'Guard unsaved edits with useUnsavedChanges, so Back, Escape, the hub switch, the close button and Quit ask first.',
  ],
  a11y: [
    'The session name field is labelled.',
    'Where is a radio group named Where; a locked option says why.',
    'An error is an alert with one plain sentence, and Retry when a load failed.',
    'An off Start session is described by its reason.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'a session being set up'],
    rule: 'The configuration of one session.',
  },
  example: `import { SessionBuilder } from '../SessionBuilder';

const SessionBuilderSample = ({ templateId }: { templateId?: string }) => <SessionBuilder templateId={templateId} />;
`,
  propsHash: '2ce78803ad7c1e1c',
} satisfies ComponentUsage;

export { usage };
