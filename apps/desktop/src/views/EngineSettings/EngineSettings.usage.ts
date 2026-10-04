/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The engine page: its state, the Archipelago version, its folder and the set up, check and show progress buttons.',
  useWhen: [
    'The Engine page of the Multiworld settings group.',
  ],
  avoidWhen: [
    { case: 'The engine state as a fact on the home banner.', use: 'FactsPanel' },
    { case: 'A short message that the engine is missing.', use: 'Callout' },
  ],
  rules: [
    'Read the engine state from useEngineStore and check it again when the page opens.',
    'Draw the buttons as SettingActions row actions and turn them off while the engine builds.',
    'Once ready, Check again is the primary action and Rebuild is a danger action whose confirm focuses Cancel.',
    'Set up and Rebuild open the job dialog with the steps and the log; Show progress, or Show the last set up once it ended, opens that dialog again.',
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
