/* @layer tests @kind test */
import { expect, test } from 'vitest';
import { onlineFromLog } from '../../src/widgets/live-room/online-from-log';
import { withPresence } from '../../src/widgets/live-room/with-presence';

const LOG = [
  'Notice (all): Link (Team #1) tracking Ship of Harkinian has joined. Client(0.6.7), [\'Tracker\', \'NoText\'].',
  'Notice (all): Link (Team #1) playing Ship of Harkinian has joined. Client(0.6.7), [].',
  'Notice (all): Lunais (Team #1) playing Timespinner has joined. Client(0.6.7), [].',
  'Notice (all): Lunais (Team #1) has left the game. Client(0.6.7), [].',
  'Notice (all): Link (Team #1) has left the game. Client(0.6.7), [\'Tracker\', \'NoText\'].',
];

test('only game clients count as online; a tracker joining or leaving changes nothing', () => {
  expect(onlineFromLog(LOG)).toEqual({ Link: true, Lunais: false });
});

test('presence overrides the stored status except a goal', () => {
  expect(withPresence('connected', false)).toBe('offline');
  expect(withPresence('unknown', true)).toBe('connected');
  expect(withPresence('playing', true)).toBe('playing');
  expect(withPresence('goal', false)).toBe('goal');
  expect(withPresence('ready', undefined)).toBe('ready');
});
