/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { matchStage } from '../src';

describe('matchStage', () => {
  test.each([
    ['Generating for 2 players, 11 Seed 123 with plando: bosses', { stage: 'rolling' }],
    ['Creating MultiWorld.', { stage: 'worlds' }],
    ['Creating Items.', { stage: 'items' }],
    ['Calculating Access Rules.', { stage: 'rules' }],
    ['Filling the multiworld with 412 items.', { stage: 'fill' }],
    ['Current fill step (Progression) at 30/120 items placed.', { stage: 'fill', done: 30, total: 120 }],
    ['Balancing multiworld progression for 2 Players.', { stage: 'balance' }],
    ['Skipping multiworld progression balancing.', { stage: 'balance' }],
    ['Beginning output...', { stage: 'output' }],
    ['Generating output files (1/2).', { stage: 'output', done: 1, total: 2 }],
    ['Creating final archive at C:\\out\\AP_1.zip', { stage: 'archive', detail: 'C:\\out\\AP_1.zip' }],
    ['Done. Enjoy. Total Time: 2.1', { stage: 'done' }],
  ])('%s', (line, expected) => {
    expect(matchStage(line)).toEqual(expected);
  });

  test('other lines are not stages', () => {
    expect(matchStage('Found 76 World Types:')).toBeUndefined();
  });
});
