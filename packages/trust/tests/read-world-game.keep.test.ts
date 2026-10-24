/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { strToU8, zipSync } from 'fflate';
import { lieAboutSize as declare } from '@archipelia/model/testing';
import { readWorldGame } from '../src/verify/read-world-game';

describe('I-81: the game of a world is read with caps', () => {
  test('reads the game from the manifest', () => {
    expect(readWorldGame(zipSync({ 'demo/archipelago.json': strToU8('{"game":"Demo"}') }))).toBe('Demo');
  });

  test('a manifest that lies about its size gives no game', () => {
    expect(readWorldGame(declare(zipSync({ 'demo/archipelago.json': new Uint8Array(1024 * 1024) }), 100))).toBeNull();
  });

  test('an entry that declares more than an apworld may hold gives no game', () => {
    expect(readWorldGame(declare(zipSync({ 'demo/archipelago.json': strToU8('{"game":"Demo"}') }), 512 * 1024 * 1024))).toBeNull();
  });
});
