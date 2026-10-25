/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The games store: every world in three sections, Installed, Official and Community, with one search and filters over all of them, a refresh of the index and a status bar.',
  useWhen: [
    'The Games page.',
  ],
  avoidWhen: [
    { case: 'One world on its own.', use: 'GameCard' },
    { case: 'A list of presets of the installed games.', use: 'PresetsHub' },
  ],
  rules: [
    'Put each installed game in search, pointing at the Games page.',
    'Show the sections in this order: Installed, Official, Community. Hide a section the search or filters empty.',
    'One search field and the filters the user adds (source, installed, version fit, stability, tags) cover all the sections at once.',
    'Guard each install with its world as the key, through useKeyedGuard, so only its card shows it working, with its Add button loading.',
    'Guard Refresh index and Add from file with their own keys, so a card install leaves them on.',
    'Cap the number of cards drawn in each section, say how many are shown of how many, and offer Show more.',
    'Keep the totals and Add from file in the status bar at the foot.',
    'Removing a game asks first with the number of presets and sessions that use it.',
    'Toast each install and removal once it is done.',
  ],
  a11y: [
    'The search field has a placeholder that says what it finds.',
    'Refresh index and Add from file are icon buttons with a name and a hint.',
    'An error is an alert with one plain sentence, and Retry when the games did not load; an empty result says why: No world matches only while a search or a filter is on.',
    'Each card action is named after its world.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the games to install'],
    rule: 'Every world to add, update or remove.',
  },
  example: `import { GameStore } from '../GameStore';

const GameStoreSample = () => <GameStore />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
