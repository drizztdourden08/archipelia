/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { strToU8, zipSync } from 'fflate';
import { lieAboutSize as declare } from '@archipelia/model/testing';
import { readApworld } from '../../src/lobby/checks/read-apworld';

const MIB = 1024 * 1024;

const NOT_VALID = { ok: false, problem: 'is not a valid apworld zip' };

describe('I-81: an uploaded apworld is read with caps', () => {
  test('a normal apworld reads its package and manifest', () => {
    const zip = zipSync({ 'demo/__init__.py': strToU8(''), 'demo/archipelago.json': strToU8('{"game":"Demo","world_version":"1.0.0"}') });
    expect(readApworld(zip)).toMatchObject({ ok: true, module: 'demo', manifest: { game: 'Demo', worldVersion: '1.0.0' } });
  });

  test('a manifest that lies about its size is refused, not inflated into memory', () => {
    const zip = zipSync({ 'demo/archipelago.json': new Uint8Array(8 * MIB), 'demo/__init__.py': strToU8('') });
    expect(readApworld(declare(zip, 1024))).toEqual(NOT_VALID);
  });

  test('an entry that declares more than an apworld may hold is refused', () => {
    const zip = zipSync({ 'demo/data.bin': new Uint8Array(1000), 'demo/__init__.py': strToU8('') });
    expect(readApworld(declare(zip, 512 * MIB))).toEqual(NOT_VALID);
  });

  test('an archive with a flood of entries is refused', () => {
    const many = Object.fromEntries(Array.from({ length: 5000 }, (_, index) => [`demo/f${index}.py`, strToU8('')]));
    expect(readApworld(zipSync(many))).toEqual(NOT_VALID);
  });
});
