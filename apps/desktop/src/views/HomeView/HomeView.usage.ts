/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Multiworld home banner: the engine state, the facts with the counts, the run again action and the recent runs, or the setup checklist before the first run.',
  useWhen: [
    'The hero home of the Multiworld bucket.',
  ],
  avoidWhen: [
    { case: 'A banner with art for another bucket.', use: 'Hero' },
    { case: 'One number on an overview.', use: 'StatTile' },
  ],
  rules: [
    'Fill only the hero slots it is given; the hub draws the frame.',
    'Load the engine, the library and the runs when it opens, together.',
    'Keep exactly one primary action: Open Engine while the engine is not ready, the next setup step before the first run, else Run again.',
    'Before the first run, show the four setup steps (Engine, Games, Preset, Session) with their state and a button to each; hide them once a run exists.',
    'Make the title say what to do next, such as Set up the engine, Add your first game or Ready to host.',
  ],
  a11y: [
    'The hero title says what to do next; the eyebrow carries the engine state.',
    'An error is an alert; no run yet shows an empty state.',
    'The run again button names the session it runs again.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the home banner'],
    rule: 'The first view of the Multiworld hub.',
  },
  example: `import type { HeroProps } from '@drizztdourden08/brock-react';
import { HomeView } from '../HomeView';

const HomeViewSample = ({ slots }: HeroProps) => <HomeView slots={slots} />;
`,
  propsHash: '69479b4fb8f00e28',
} satisfies ComponentUsage;

export { usage };
