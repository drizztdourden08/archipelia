/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The engine page: the Archipelago and Python pickers with the version tag, the version list and Check now, the installed engines, and the status of the engine in use.',
  useWhen: [
    'The Engine page of the Multiworld settings group.',
  ],
  avoidWhen: [
    { case: 'The engine state as a fact on the home banner.', use: 'FactsPanel' },
    { case: 'A short message that the engine is missing.', use: 'Callout' },
  ],
  rules: [
    'Read the engine state and the versions from useEngineStore and load them again when the page opens.',
    'Draw three SettingsSections: Versions, Installed engines and Status.',
    'Both pickers are searchable selects that list any version, newer or older; the version tag from the overview sits on both rows and reads New version, Up to date or Not checked.',
    'Install and switch appears only when the picked pair is not installed, and Switch when it is installed but not in use. The row sits directly under the two pickers.',
    'Check now asks GitHub again; an offline or rate limited feed is a problem line on the version list row.',
    'The Python picker turns off the builds the picked Archipelago does not fit, with the reason, and moves to the newest fitting build with a problem line when the pick no longer fits.',
    'A Dependencies row lists the pip packages of the engine in use and the rules applied, in a Disclosure.',
    'Each installed engine shows its size, its sessions, and the Active, Last good and Failed tags; past two engines the section names the total size.',
    'Remove asks with confirmDelete and names the sessions made with it. It is off for an engine a running session uses. Removing the engine in use says so, then opens the first run install dialog.',
    'Draw the buttons as SettingActions row actions and turn them off while the engine builds.',
    'Once ready, Check again is the primary action and Rebuild is a danger action whose confirm focuses Cancel.',
    'Set up and Rebuild open the job dialog with the steps and the log; Show progress, or Show the last set up once it ended, opens that dialog again.',
    'While the set up runs, show its progress bar and current step on the page too.',
    'Open folder sits next to the folder path and opens that folder in the file manager; it is off while the engine is not set up.',
    'A failed set up is one plain sentence; its raw error goes to the app log.',
  ],
  a11y: [
    'The state is text in a Status.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the engine'],
    rule: 'The private engine that generates and hosts.',
  },
  example: `import { EngineSettings } from '../EngineSettings';

const EngineSettingsSample = () => <EngineSettings />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
