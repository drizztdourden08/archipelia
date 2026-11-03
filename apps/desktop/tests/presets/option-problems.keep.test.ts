/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { problemItems } from '../../src/views/PresetEditor/behavior/problem-items';
import { DEMO } from './demo-schema';

describe('K1 problemItems', { tags: ['critical'] }, () => {
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
