/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The spoiler widget of a session dashboard: the spoiler log of the run, covered until the player asks for it, then a searchable tracker of every placement.',
  useWhen: [
    'The spoiler widget of a run on the session dashboard.',
  ],
  avoidWhen: [
    { case: 'The room, the players or the logs of a live run.', use: 'SessionDashboard' },
    { case: 'A finished run and its output files.', use: 'History' },
  ],
  rules: [
    'Show a plain empty state when the session has no spoiler, and say that raising the spoiler level gives one.',
    'Keep the spoiler covered until the player presses Show spoiler, and keep that choice per session in the widget state.',
    'Once shown, read the log and list the placements, the playthrough, the entrances, the paths, the settings and the raw text in tabs.',
    'Group the placements by finder, receiver, game, sphere or item type, and filter them with the search box.',
    'Hide covers the spoiler again.',
  ],
  a11y: [
    'Show spoiler and Hide are real buttons named by what they do.',
    'The tabs are a tab list, and the search box is named by what it filters.',
  ],
  tree: {
    path: ['data', 'the spoiler of one run, covered until asked for'],
    rule: 'The spoiler of one run, covered until asked for.',
  },
  example: `import type { Session } from '@archipelia/model';
import { SpoilerWidget } from '../SpoilerWidget';

const SpoilerWidgetSample = ({ session }: { session: Session }) => <SpoilerWidget session={session} />;
`,
  propsHash: 'ea1805876ef701ab',
} satisfies ComponentUsage;

export { usage };
