/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { emptyKind } from '../../src/views/GameStore/behavior/empty-kind';
import type { GameRow } from '../../src/views/GameStore/GameStore.type';
import { entry, handlers, row } from './game-handlers.fixtures';

describe('games store view', () => {
  test('the empty text says why the list is empty, and each tab says its own', () => {
    expect(emptyKind(true, true)).toBe('loading');
    expect(emptyKind(true, false)).toBe('search');
    expect(emptyKind(false, false)).toBe('none');
    expect(emptyKind(false, false, 'installed')).toBe('installed');
    expect(emptyKind(false, false, 'updates')).toBe('updates');
    expect(emptyKind(true, false, 'installed')).toBe('search');
  });

  test('the card opens its details and carries no hover hint text', () => {
    let opened = false;
    const card = cardPropsOf(row, { ...handlers([]), open: () => { opened = true; } });
    card.onOpen?.();
    expect(opened).toBe(true);
    expect(card).not.toHaveProperty('summary');
    expect(card).not.toHaveProperty('summaryHint');
  });

  test('the kind is an icon kind, never a word, and the version is the world version', () => {
    const community: GameRow = { entry: { ...entry, source: 'index', versions: [{ version: '1.2.0', url: 'u' }] }, latest: { version: '1.2.0', url: 'u' }, state: 'available' };
    expect(cardPropsOf(community, handlers([]))).toMatchObject({ kind: 'community', version: '1.2.0', status: undefined });
    expect(cardPropsOf(row, handlers([]))).toMatchObject({ kind: 'official', version: undefined });
  });

  test('an official card shows a version only when the world has its own, never the engine version', () => {
    const own: GameRow = { entry: { ...entry, versions: [{ version: '2.1.0', url: 'u' }] }, latest: { version: '2.1.0', url: 'u' }, state: 'available' };
    expect(cardPropsOf(own, handlers([])).version).toBe('2.1.0');
    const engineGame = { apworld: 'hk', game: 'HK', version: '0.6.7', source: 'official', installedAt: 0 } as GameRow['installed'];
    expect(cardPropsOf({ entry, installed: engineGame, state: 'installed' }, handlers([])).version).toBeUndefined();
  });
});
