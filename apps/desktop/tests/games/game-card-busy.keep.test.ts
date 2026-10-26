/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { busyOf } from '../../src/views/GameStore/behavior/busy-of';
import { busyText } from '../../src/views/GameStore/behavior/busy-text';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { failureOf } from '../../src/views/GameStore/behavior/failure-of';
import { reasonOf } from '../../src/views/GameStore/behavior/reason-of';
import { removeKey } from '../../src/views/GameStore/behavior/remove-key';
import type { GameRow } from '../../src/views/GameStore/GameStore.type';
import { entry, handlers, installedGame, row } from './game-handlers.fixtures';

describe('a game card while it works', () => {
  test('the card being installed loads its Add button and reads Adding...', () => {
    expect(cardPropsOf(row, handlers([])).actions[0]).toMatchObject({ label: 'Add', icon: 'download', loading: false, disabled: false });
    expect(cardPropsOf(row, handlers(['hk'])).actions[0]).toMatchObject({ label: 'Adding...', loading: true, disabled: true });
    expect(cardPropsOf(row, handlers(['load', 'file'])).actions[0]).toMatchObject({ label: 'Add', loading: false, disabled: false });
  });

  test('a busy card shows what it is doing and turns every other action off', () => {
    const card = cardPropsOf(row, handlers(['hk']));
    expect(card.status).toBe('adding');
    expect(card.actions.every((action) => action.disabled)).toBe(true);
    const home: GameRow = { entry: { ...entry, home: 'https://x' }, state: 'available' };
    expect(cardPropsOf(home, handlers(['hk'])).actions.find((action) => action.id === 'home')?.disabled).toBe(true);
  });

  test('an update reads Updating... and a removal reads Removing... on the card and on its action', () => {
    const update: GameRow = { ...row, state: 'update', installed: installedGame };
    expect(busyOf(update, handlers(['hk']))).toBe('updating');
    expect(cardPropsOf(update, handlers(['hk'])).actions[0]).toMatchObject({ label: 'Updating...', loading: true });
    expect(busyOf(update, handlers([removeKey('hk')]))).toBe('removing');
    expect(cardPropsOf(update, handlers([removeKey('hk')])).actions.map((action) => [action.label, action.disabled, action.loading])).toEqual([
      ['Update', true, false], ['Removing...', true, true],
    ]);
    expect(busyOf(row, handlers([]))).toBeUndefined();
  });

  test('the busy sentence names the game', () => {
    expect(busyText('adding', 'Timespinner')).toBe('Adding Timespinner...');
    expect(busyText('updating', 'Timespinner')).toBe('Updating Timespinner...');
    expect(busyText('removing', 'Timespinner')).toBe('Removing Timespinner...');
  });

  test('a failed action marks its own card with the reason and restores Add', () => {
    const failed = handlers([], { hk: 'failed to load: ctrdi (ModuleNotFoundError: No module named ctrando)' });
    expect(failureOf(row, failed)).toBe('failed to load: ctrdi (ModuleNotFoundError: No module named ctrando)');
    expect(cardPropsOf(row, failed)).toMatchObject({ status: 'failed' });
    expect(cardPropsOf(row, failed).actions[0]).toMatchObject({ label: 'Add', disabled: false, loading: false });
    expect(failureOf(row, handlers([], { [removeKey('hk')]: 'in use' }))).toBe('in use');
    expect(failureOf(row, handlers([], { other: 'no' }))).toBeUndefined();
  });

  test('the reason is the sentence the main process threw, without the IPC wrapper', () => {
    const wrapped = new Error("Error invoking remote method 'ap:games:install': Error: Chrono Trigger: failed to load");
    expect(reasonOf(wrapped, 'Could not install the game.')).toBe('Chrono Trigger: failed to load');
    expect(reasonOf('plain', 'Could not install the game.')).toBe('plain');
    expect(reasonOf(new Error(''), 'Could not install the game.')).toBe('Could not install the game.');
  });
});
