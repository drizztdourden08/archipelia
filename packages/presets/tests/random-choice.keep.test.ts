/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { optionDef as option } from '@archipelia/model';
import type { GameSchema } from '@archipelia/model';
import { checkValues, defaultValues } from '../src';

const MEDALLION_CHOICES = [{ value: 'ether', label: 'ether' }, { value: 'bombos', label: 'bombos' }, { value: 'quake', label: 'quake' }];

const ALTTP: GameSchema = {
  game: 'A Link to the Past', worldVersion: '0.6.7', groups: ['Item & Location Options'], presets: {},
  options: [
    option({ key: 'misery_mire_medallion', displayName: 'Misery Mire Medallion', kind: 'choice', default: 'random', choices: MEDALLION_CHOICES }),
    option({ key: 'turtle_rock_medallion', displayName: 'Turtle Rock Medallion', kind: 'choice', default: 'random', choices: MEDALLION_CHOICES }),
  ],
};

describe('a choice that defaults to random', () => {
  test('the untouched defaults need no fix, so they never block a save', () => {
    expect(defaultValues(ALTTP)).toEqual({ misery_mire_medallion: 'random', turtle_rock_medallion: 'random' });
    expect(checkValues(ALTTP, defaultValues(ALTTP))).toEqual([]);
  });

  test('random is accepted on any choice, and a name outside the list is still refused', () => {
    expect(checkValues(ALTTP, { misery_mire_medallion: 'quake' })).toEqual([]);
    expect(checkValues(ALTTP, { misery_mire_medallion: 'moon' })).toEqual([{ key: 'misery_mire_medallion', expected: 'one of the listed choices' }]);
  });
});
