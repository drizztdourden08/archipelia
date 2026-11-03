/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { consoleNamesList } from '../../src/views/SessionDashboard/behavior/console-names-list';

const room = {
  players: [{ team: 0, slot: 1, name: 'Ana', game: 'A Link to the Past' }, { team: 0, slot: 2, name: 'Bo', game: 'Timespinner' }],
  names: {
    'A Link to the Past': { items: ['Moon Pearl', 'Hookshot'], locations: ['Link\'s House'] },
    Timespinner: { items: ['Timespinner Wheel'], locations: [] },
  },
};

describe('K2 console item and location lists', { tags: ['critical'] }, () => {
  test('a chosen player lists the item and location names of their game', () => {
    expect(consoleNamesList('items', room)({ player: 'Ana' })).toEqual([{ value: 'Moon Pearl' }, { value: 'Hookshot' }]);
    expect(consoleNamesList('locations', room)({ player: 'Bo' })).toEqual([]);
  });

  test('no chosen player or an unknown one lists nothing', () => {
    expect(consoleNamesList('items', room)({ player: null })).toEqual([]);
    expect(consoleNamesList('items', room)({ player: 'Zed' })).toEqual([]);
  });
});
