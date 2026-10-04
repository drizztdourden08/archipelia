/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Multiworld home banner: the engine headline, the counts, the facts, the run again action and the recent sessions.',
  useWhen: [
    'The hero home of the Multiworld bucket.',
  ],
  avoidWhen: [
    { case: 'A banner with art for another bucket.', use: 'Hero' },
    { case: 'One number on an overview.', use: 'StatCard' },
  ],
  rules: [
    'Fill only the hero slots it is given; the hub draws the frame.',
    'Load the engine, the library and the runs when it opens, together.',
    'Offer Open Engine as the primary action while the engine is not ready.',
  ],
  a11y: [
    'The headline is the hero title.',
    'An error is an alert; no session yet shows an empty state.',
    'The run again button names the session it runs.',
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
