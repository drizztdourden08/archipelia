/* @layer tests @kind test */
import { expect, test } from 'vitest';
import { hintsFromLog } from '../src/live-room';

const LOG = [
  'Notice (all): Ana: !hint_location Bottom Left Chest',
  "Notice (Team #1): [Hint]: Bo's Sword is at Bottom Left Chest in Ana's World. (unspecified)",
  "Notice (Team #1): [Hint]: Ana's Shield is at Top Chest in Bo's World at Cave Door. (found)",
  "Notice (Team #1): [Hint]: Bo's Sword is at Bottom Left Chest in Ana's World. (priority)",
];

test('a hint line of the server log becomes a hint row, the last state of a hint wins', () => {
  expect(hintsFromLog(LOG)).toEqual([
    { key: 'Ana-Bottom Left Chest', item: 'Sword', receiver: 'Bo', finder: 'Ana', location: 'Bottom Left Chest', entrance: '', state: 'priority' },
    { key: 'Bo-Top Chest', item: 'Shield', receiver: 'Ana', finder: 'Bo', location: 'Top Chest', entrance: 'Cave Door', state: 'found' },
  ]);
});
