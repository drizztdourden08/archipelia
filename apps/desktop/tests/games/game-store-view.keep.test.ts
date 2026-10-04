/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { CatalogEntry } from '@archipelia/model';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { emptyKind } from '../../src/views/GameStore/behavior/empty-kind';
import { removeKey } from '../../src/views/GameStore/behavior/remove-key';
import type { GameRow } from '../../src/views/GameStore/GameStore.type';

const entry: CatalogEntry = { apworld: 'hk', game: 'HK', displayName: 'Hollow Knight', tags: [], source: 'official', stability: 'unknown', versions: [] };
const row: GameRow = { entry, state: 'available' };
const noop = () => {};
const handlers = (busy: string[]) => ({ isBusy: (key: string) => busy.includes(key), installWorld: noop, remove: noop, openHome: noop });

describe('games store view', () => {
  test('the empty text says why the list is empty', () => {
    expect(emptyKind('updates', '', true)).toBe('loading');
    expect(emptyKind('updates', 'zz', false)).toBe('search');
    expect(emptyKind('updates', ' ', false)).toBe('updates');
    expect(emptyKind('installed', '', false)).toBe('installed');
    expect(emptyKind('official', '', false)).toBe('catalog');
  });

  test('the card being installed loads its Add button and reads Adding...', () => {
    expect(cardPropsOf(row, handlers([])).actions[0]).toMatchObject({ label: 'Add', loading: false, disabled: false });
    expect(cardPropsOf(row, handlers(['hk'])).actions[0]).toMatchObject({ label: 'Adding...', loading: true, disabled: true });
    expect(cardPropsOf(row, handlers(['load', 'file'])).actions[0]).toMatchObject({ label: 'Add', loading: false, disabled: false });
  });

  test('a removal turns the card off without loading its install button', () => {
    const update: GameRow = { ...row, state: 'update', installed: { apworld: 'hk', game: 'HK', version: '1', source: 'official', installedAt: 0 } as GameRow['installed'] };
    expect(cardPropsOf(update, handlers([removeKey('hk')])).actions.map((action) => [action.label, action.disabled, action.loading])).toEqual([
      ['Update', true, false], ['Remove', true, undefined],
    ]);
  });
});
