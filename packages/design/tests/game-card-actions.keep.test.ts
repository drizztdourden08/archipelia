/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { actionOf } from '../src/compounds/GameCard/behavior/action-of';
import type { GameCardAction } from '../src/compounds/GameCard/GameCard.type';

const noop = () => {};
const base: GameCardAction = { id: 'install', label: 'Add', icon: 'download', onClick: noop };

describe('GameCard actions', () => {
  test('every action is an icon only Tessera action named by its label and the world', () => {
    expect(actionOf(base, 'Timespinner')).toMatchObject({ id: 'install', label: 'Add', nameSuffix: 'Timespinner', icon: 'download', iconOnly: true, kind: 'default' });
  });

  test('the primary action is primary and a removal is danger without its own ask', () => {
    expect(actionOf({ ...base, primary: true }, 'W').kind).toBe('primary');
    expect(actionOf({ ...base, tone: 'danger' }, 'W')).toMatchObject({ kind: 'danger', confirm: false });
  });

  test('a loading action stays loading and a busy one stays disabled', () => {
    expect(actionOf({ ...base, loading: true }, 'W').loading).toBe(true);
    expect(actionOf({ ...base, disabled: true }, 'W').disabled).toBe(true);
  });
});
