/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { GameSchema, InstalledGame } from '@archipelia/model';
import { memberSlotOptions } from '../../src/views/LobbyMembers/behavior/member-slot-options';
import { optionText } from '../../src/views/LobbyMembers/behavior/option-text';
import { optionsOfYaml } from '../../src/views/LobbyMembers/behavior/options-of-yaml';

const GAME = 'Quest';

const schema: GameSchema = {
  game: GAME, worldVersion: '1.0.0', groups: ['Goal', 'Items'], presets: {},
  options: [
    { key: 'goal', displayName: 'Goal', group: 'Goal', kind: 'choice', description: '', default: 'boss', choices: [{ value: 'boss', label: 'Defeat the boss' }, { value: 'all', label: 'Collect everything' }], visibility: ['simple'], weightable: true },
    { key: 'hearts', displayName: 'Starting hearts', group: 'Items', kind: 'range', description: '', default: 3, range: { min: 1, max: 20 }, namedValues: { low: 1 }, visibility: ['simple'], weightable: true },
    { key: 'shuffle', displayName: 'Shuffle items', group: 'Items', kind: 'toggle', description: '', default: true, visibility: ['simple'], weightable: true },
  ],
};

const yamlOf = (block: string) => lines('name: Zelda', `game: ${GAME}`, `${GAME}:`, block);

const lines = (...rows: string[]) => rows.join('\n');

const installed = (): InstalledGame[] => [{ apworld: 'quest', game: GAME, schema } as InstalledGame];

describe('K1 the text of an option value', { tags: ['critical'] }, () => {
  test('reads toggles, choices, named numbers, lists and weights in plain words', () => {
    expect(optionText(true)).toBe('On');
    expect(optionText(false)).toBe('Off');
    expect(optionText(null)).toBe('Not set');
    expect(optionText('all', schema.options[0])).toBe('Collect everything');
    expect(optionText('mystery', schema.options[0])).toBe('mystery');
    expect(optionText(1, schema.options[1])).toBe('low (1)');
    expect(optionText(7, schema.options[1])).toBe('7');
    expect(optionText([])).toBe('None');
    expect(optionText(['a', 'b'])).toBe('a, b');
    expect(optionText({ boss: 50, all: 25 }, schema.options[0])).toBe('Defeat the boss: 50, Collect everything: 25');
  });
});

describe('K1 the options of a player file', { tags: ['critical'] }, () => {
  test('groups the options like the world and puts the ones it does not know last', () => {
    const { groups, problem } = optionsOfYaml(yamlOf(lines('  hearts: 5', '  shuffle: false', '  goal: all', '  extra_thing: 4')), GAME, schema);
    expect(problem).toBeUndefined();
    expect(groups.map((group) => group.name)).toEqual(['Goal', 'Items', 'Other options']);
    expect(groups[0]?.rows).toEqual([{ key: 'goal', label: 'Goal', value: 'Collect everything' }]);
    expect(groups[1]?.rows.map((row) => [row.label, row.value])).toEqual([['Starting hearts', '5'], ['Shuffle items', 'Off']]);
    expect(groups[2]?.rows).toEqual([{ key: 'extra_thing', label: 'extra_thing', value: '4' }]);
  });

  test('lists every option in one plain group when the world is not known', () => {
    const { groups } = optionsOfYaml(yamlOf(lines('  hearts: 5', '  shuffle: true')), GAME);
    expect(groups).toEqual([{ name: 'Options', rows: [{ key: 'hearts', label: 'hearts', value: '5' }, { key: 'shuffle', label: 'shuffle', value: 'On' }] }]);
  });

  test('says so when the file has no options for the game or cannot be read', () => {
    expect(optionsOfYaml(lines('name: Zelda', `game: ${GAME}`, ''), GAME, schema)).toEqual({ groups: [], problem: `The file sets no options for ${GAME}.` });
    expect(optionsOfYaml(lines('- just', '- a list', ''), GAME).problem).toBe('The file of this player could not be read as YAML.');
    expect(optionsOfYaml('a: [unclosed', GAME).problem).toBe('The file of this player could not be read as YAML.');
  });
});

describe('K1 the slots a host reads', { tags: ['critical'] }, () => {
  test('keep the raw file and flag a world that is not installed, and a slot with no file yet', () => {
    const [known, other, missing] = memberSlotOptions(
      { memberId: 'm_1', slots: [{ name: 'Zelda', game: GAME, yaml: yamlOf('  hearts: 5') }, { name: 'Link', game: 'Relic', yaml: lines('name: Link', 'game: Relic', 'Relic:', '  speed: fast', '') }, { name: 'Ganon', game: GAME, yaml: null }] },
      installed(),
    );
    expect(known).toMatchObject({ name: 'Zelda', known: true, yaml: expect.stringContaining('hearts: 5') as string });
    expect(known?.groups[0]?.name).toBe('Items');
    expect(other).toMatchObject({ name: 'Link', known: false, groups: [{ name: 'Options', rows: [{ label: 'speed', value: 'fast' }] }] });
    expect(missing).toMatchObject({ yaml: null, groups: [], problem: 'This player has not sent the file yet.' });
  });
});
