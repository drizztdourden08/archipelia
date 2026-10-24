/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { zipSync } from 'fflate';
import { zipEntries } from '../src/output/zip-entries';
import { zipEntryBytes } from '../src/output/zip-entry-bytes';

const text = (value: string) => new TextEncoder().encode(value);

const lyingAboutSize = (declared: number) => {
  const zip = zipSync({ 'bomb.txt': new Uint8Array(1024 * 1024) });
  const data = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const end = zip.byteLength - 22;
  const central = data.getUint32(end + 16, true);
  data.setUint32(central + 24, declared, true);
  return zip;
};

const small = { entries: 3, entryBytes: 1000, totalBytes: 1500 };

describe('A2: generator zips are read with limits', () => {
  test('reads stored and deflated entries back', () => {
    const zip = zipSync({ 'a.txt': text('alpha '.repeat(100)), 'b.txt': [text('beta'), { level: 0 }] });
    const entries = zipEntries(zip);
    expect(entries.map((entry) => [entry.name, entry.method])).toEqual([['a.txt', 8], ['b.txt', 0]]);
    expect(entries.map((entry) => new TextDecoder().decode(zipEntryBytes(zip, entry)))).toEqual(['alpha '.repeat(100), 'beta']);
  });

  test('an entry that inflates past its declared size is stopped', () => {
    const zip = lyingAboutSize(4096);
    const [entry] = zipEntries(zip);
    if (!entry) throw new Error('no entry');
    expect(() => zipEntryBytes(zip, entry)).toThrow('inflates past its declared size');
  });

  test('a declared size over the entry cap is refused before any inflating', () => {
    expect(() => zipEntries(zipSync({ 'big.txt': new Uint8Array(2000) }), small)).toThrow('larger than this server takes');
  });

  test('entries that add up past the total cap are refused', () => {
    expect(() => zipEntries(zipSync({ 'a.txt': new Uint8Array(900), 'b.txt': new Uint8Array(900) }), small)).toThrow('larger than this server takes');
  });

  test('too many entries are refused', () => {
    const many = Object.fromEntries(['a', 'b', 'c', 'd'].map((name) => [name, text(name)]));
    expect(() => zipEntries(zipSync(many), small)).toThrow('more than 3 entries');
  });
});
