/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The games store: the worlds of the Games page in a tab each, All with its sections Installed, Built-in, Archipelia ready and Archipelago index, then one tab per section and an Updates tab, with one search and filters over the tab, a refresh of the index and a status bar.',
  useWhen: [
    'The Games page.',
  ],
  avoidWhen: [
    { case: 'One world on its own.', use: 'GameCard' },
    { case: 'A list of presets of the installed games.', use: 'PresetsHub' },
  ],
  rules: [
    'Put each installed game in search, pointing at the Games page.',
    'Keep the dedicated tabs Installed, Built-in, Archipelia ready, Archipelago index and Updates beside All; each shows only its own worlds under its own heading and count.',
    'On the All tab show the sections in this order: Installed, Built-in, Archipelia ready, Archipelago index, each under a heading with its own count. Hide a section the search or filters empty.',
    'One search field and the filters the user adds (category, installed, version fit, stability, tags) cover every section of the tab at once.',
    'Show a Verified tag, with the hint Listed and checked by Archipelia, on every world listed in the Archipelia registry, on its card and in its details dialog.',
    'Guard each install with its world as the key, through useKeyedGuard, so only its card shows it working, with its Add button loading.',
    'Guard Refresh index and Add from file with their own keys, so a card install leaves them on.',
    'Draw only the cards in view, in a virtual grid whose section headings carry the true count of the section; never cap a section.',
    'Open a card in its details dialog with the title or Enter; the card carries no hover hint.',
    'Show the reason an install or removal failed on the card and in its dialog, never as a banner at the top of the page.',
    'Keep the totals and Add from file in the status bar at the foot. All worlds counts every section of the library, and a world without a release is counted apart.',
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

const GameStoreSample = () => <GameStore tab="all" />;
`,
  propsHash: '62ca6a3e76ef8e42',
} satisfies ComponentUsage;

export { usage };
