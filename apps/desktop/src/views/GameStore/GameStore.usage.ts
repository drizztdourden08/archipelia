/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The games store: the worlds of one tab as cards, with search, a refresh of the index and adding a world from a file.',
  useWhen: [
    'Each tab of the Games page: installed, official, community and updates.',
  ],
  avoidWhen: [
    { case: 'One world on its own.', use: 'GameCard' },
    { case: 'A list of presets of the installed games.', use: 'PresetsHub' },
  ],
  rules: [
    'Pick the tab from the page tab; the view filters the rows for it.',
    'Guard each install with its world as the key, through useKeyedGuard, so its card shows it working.',
    'Cap the number of cards drawn, say how many are shown of how many, and offer Show more.',
    'Removing a game asks first with the number of presets and templates that use it.',
  ],
  a11y: [
    'The search field has a placeholder that says what it finds.',
    'An error is an alert; an empty result says why.',
    'Each card action is named after its world.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the games to install'],
    rule: 'Every world to add, update or remove.',
  },
  example: `import { GameStore } from '../GameStore';

const GameStoreSample = () => <GameStore tab="installed" />;
`,
  propsHash: 'e1088abeb010a282',
} satisfies ComponentUsage;

export { usage };
