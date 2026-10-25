/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { ALL_TAB } from '../../src/views/PresetEditor/PresetEditor.constants';
import { jumpFilter } from '../../src/views/PresetEditor/behavior/jump-filter';
import { problemItems } from '../../src/views/PresetEditor/behavior/problem-items';
import { DEMO } from './demo-schema';

const def = (key: string) => {
  const found = DEMO.options.find((option) => option.key === key);
  if (!found) throw new Error(`no option ${key}`);
  return found;
};

describe('problemItems', () => {
  test('each refused option says what it needs and what it holds, and names its own row', () => {
    const items = problemItems(DEMO, [{ key: 'goal', expected: 'one of the listed choices' }], { goal: 'moon' }, []);
    expect(items).toEqual([{ id: 'goal', field: 'goal', message: 'Goal: expected one of the listed choices, found "moon".' }]);
  });

  test('JSON that does not parse is listed once, even when its value is refused too', () => {
    const items = problemItems(DEMO, [{ key: 'bosses', expected: 'a table of names' }], { bosses: [] }, ['bosses', 'plando']);
    expect(items.map((item) => item.id)).toEqual(['bosses', 'plando']);
    expect(items[1]?.message).toBe('plando: the JSON does not parse.');
  });

  test('a long value is cut', () => {
    const items = problemItems(DEMO, [{ key: 'seed_name', expected: 'text' }], { seed_name: ['x'.repeat(80)] }, []);
    expect(String(items[0]?.message).length).toBeLessThan(110);
  });
});

describe('jumpFilter', () => {
  test('keeps a view that already shows the option', () => {
    const view = { tab: ALL_TAB, query: 'goal', showAdvanced: false };
    expect(jumpFilter(def('goal'), view)).toEqual(view);
    expect(jumpFilter(def('goal'), { ...view, tab: 'Game Options' })).toEqual({ ...view, tab: 'Game Options' });
  });

  test('switches to the tab of the option when another tab is open', () => {
    expect(jumpFilter(def('exclude'), { tab: 'Game Options', query: '', showAdvanced: false }).tab).toBe('Items');
  });

  test('clears a search that hides the option and shows advanced ones when it is advanced', () => {
    expect(jumpFilter(def('goal'), { tab: ALL_TAB, query: 'zzz', showAdvanced: false }).query).toBe('');
    expect(jumpFilter(def('plando'), { tab: ALL_TAB, query: '', showAdvanced: false }).showAdvanced).toBe(true);
  });
});
