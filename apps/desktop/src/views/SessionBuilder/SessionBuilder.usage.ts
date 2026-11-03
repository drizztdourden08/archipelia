/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The setup of a session: its name, where the room runs, whether the lobby takes direct connections and how, the room password, the world settings, how many slots it has and the actions that run it.',
  useWhen: [
    'The detail of the picked session on the Sessions page.',
    'The New session and Edit session sub-pages of the Sessions page.',
  ],
  avoidWhen: [
    { case: 'The lobby, the addresses and the status of a session that is open.', use: 'SessionLobby' },
    { case: 'The list of sessions.', use: 'Sessions' },
    { case: 'The options of one preset.', use: 'PresetEditor' },
  ],
  rules: [
    'Pass no templateId for a new session, or the id of the saved one to edit; the page loads it and says when it is gone.',
    'Hold the setup only: no lobby, no address, no status. The runs of the session are a link to History.',
    'Show the actions by state: Run for a saved session, Go to its tab when the session already has a tab, and with unsaved changes Run once with these changes beside Save and run, Save and Discard; a new session offers Save and run and Save.',
    'Run once starts the session with the form values and never writes the saved session; the form returns to the saved values after it.',
    'Run once is off, with the reason, while the name, Where or the password differ from the saved session: only Save and run takes those.',
    'Every run action is off with the first setup problem as its reason.',
    'Where (Local, LAN, Remote) sets where the room runs and who can reach it, on its own. Allow direct connections never changes Where, and Where never changes it.',
    'Choosing LAN opens nothing; Run asks once before it opens a network port.',
    'Direct connections follow Where: this computer for Local, the network for LAN, the Archipelia server for Remote. archipelago.gg and SSH say inline why they do not take direct connections.',
    'While the lobby of the session is open, Where and Allow direct connections are locked with the reason, and a callout says the session is running its lobby.',
    'The Joining group holds Direct connections, Ask before letting someone in, Unlisted clients and Allowed games, a tag picker of installed games; an empty list means any installed game.',
    'Lay the setup out compact: the name as the title with its chips and the actions on one line, the history link under it, then one row each for Where, Password and World with the Joining group beside them, with a short caption under a row only when it helps.',
    'The World row sums the world settings in one line; Change opens Advanced, which holds the local port and every generation and server rule, closed by default.',
    'Show the slots as a count (for example 5 slots, 2 open) with a line that slots are added and set up in the lobby; the config never lists or edits players.',
    'Guard unsaved edits with useUnsavedChanges, so Back, Escape, the hub switch, the close button and Quit ask first, and report them with onDirty so the page can ask before it shows another session.',
  ],
  a11y: [
    'The session name field is labelled.',
    'Where is a radio group named Where; a locked option says why.',
    'Each Joining toggle and the Allowed games picker are named by their label.',
    'An error is an alert with one plain sentence, and Retry when a load failed.',
    'An off run action is described by its reason.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'a session being set up'],
    rule: 'The configuration of one session.',
  },
  example: `import { SessionBuilder } from '../SessionBuilder';

const SessionBuilderSample = ({ templateId }: { templateId?: string }) => <SessionBuilder templateId={templateId} />;
`,
  propsHash: '9d315d1bf4cfe942',
} satisfies ComponentUsage;

export { usage };
