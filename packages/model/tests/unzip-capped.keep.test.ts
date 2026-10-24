/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { zipSync } from 'fflate';
import { APWORLD_LIMITS, unzipCapped, ZIP_LIMITS } from '../src/zip';
import type { ZipEntry } from '../src/zip';
import { lieAboutSize as declare } from '../src/testing';

const MIB = 1024 * 1024;

const text = (value: string) => new TextEncoder().encode(value);

const nothing = () => false;

const everything = () => true;

const read = (zip: Uint8Array, pick: (entry: ZipEntry) => boolean = nothing) => unzipCapped(zip, APWORLD_LIMITS, pick);

describe('I-81: the apworld zip is read with its own caps', () => {
  test('an apworld is capped tighter than a generator archive', () => {
    expect(APWORLD_LIMITS.entryBytes).toBeLessThan(ZIP_LIMITS.entryBytes);
    expect(APWORLD_LIMITS.totalBytes).toBeLessThan(ZIP_LIMITS.totalBytes);
  });

  test('only the entries asked for are inflated, and every name is listed', () => {
    const zip = zipSync({ 'demo/__init__.py': text(''), 'demo/archipelago.json': text('{"game":"Demo"}'), 'demo/data.bin': new Uint8Array(1000) });
    const { names, files } = unzipCapped(zip, APWORLD_LIMITS, ({ name }) => name.endsWith('.json'));
    expect(names).toEqual(['demo/__init__.py', 'demo/archipelago.json', 'demo/data.bin']);
    expect(Object.keys(files)).toEqual(['demo/archipelago.json']);
    expect(new TextDecoder().decode(files['demo/archipelago.json'])).toBe('{"game":"Demo"}');
  });

  test('an entry that declares more than the cap is refused before anything is inflated', () => {
    const zip = declare(zipSync({ 'demo/big.bin': new Uint8Array(1000) }), APWORLD_LIMITS.entryBytes + 1);
    expect(() => read(zip)).toThrow('larger than this server takes');
  });

  test('entries that add up past the total cap are refused', () => {
    const each = APWORLD_LIMITS.entryBytes;
    const zip = zipSync(Object.fromEntries(Array.from({ length: 5 }, (_, index) => [`demo/f${index}.bin`, new Uint8Array(10)])));
    for (let index = 0; index < 5; index += 1) declare(zip, each, index);
    expect(each * 5).toBeGreaterThan(APWORLD_LIMITS.totalBytes);
    expect(() => read(zip)).toThrow('larger than this server takes');
  });

  test('an entry that inflates past the size it declared is stopped', () => {
    const zip = declare(zipSync({ 'demo/archipelago.json': new Uint8Array(MIB) }), 4096);
    expect(() => read(zip, everything)).toThrow('inflates past its declared size');
  });

  test('too many entries are refused', () => {
    const many = Object.fromEntries(Array.from({ length: APWORLD_LIMITS.entries + 1 }, (_, index) => [`demo/f${index}.py`, text('')]));
    expect(() => read(zipSync(many))).toThrow(`more than ${APWORLD_LIMITS.entries} entries`);
  });
});
