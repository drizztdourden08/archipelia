/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { actionOf } from '../src/compounds/GameCard/behavior/action-of';
import type { GameCardAction } from '../src/compounds/GameCard/GameCard.type';

const noop = () => {};
const base: GameCardAction = { id: 'install', label: 'Add', icon: 'download', onClick: noop };

describe('GameCard actions', () => {
  test('every action is an icon only Tessera action named by its label', () => {
    expect(actionOf(base)).toMatchObject({ id: 'install', label: 'Add', icon: 'download', iconOnly: true, kind: 'default', disabled: false });
  });

  test('the primary action is primary and a removal is danger', () => {
    expect(actionOf({ ...base, primary: true }).kind).toBe('primary');
    expect(actionOf({ ...base, tone: 'danger' }).kind).toBe('danger');
  });

  test('a loading action is turned off, so only its card shows the work', () => {
    expect(actionOf({ ...base, loading: true }).disabled).toBe(true);
    expect(actionOf({ ...base, disabled: true }).disabled).toBe(true);
  });
});
