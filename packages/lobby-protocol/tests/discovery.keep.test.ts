/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import {
  BEACON_MAX_BYTES,
  BEACON_PORT,
  DISCOVERY_SERVICE,
  buildBeacon,
  buildDiscoveryTxt,
  parseBeacon,
  parseDiscoveryTxt,
} from '../src';
import type { DiscoveryBeacon, DiscoveryRecord } from '../src';

const record: DiscoveryRecord = { name: 'Friday seed server', id: 'srv_4f2a9c', protocol: 1, ap: '0.6.8', open: true };
const beacon: DiscoveryBeacon = { ...record, port: 38290 };

describe('DNS-SD record', () => {
  test('the service name and the beacon port are fixed', () => {
    expect(DISCOVERY_SERVICE).toBe('_archipelia._tcp');
    expect(BEACON_PORT).toBe(38291);
  });

  test('the builder writes the five TXT keys as strings', () => {
    expect(buildDiscoveryTxt(record)).toEqual({
      name: 'Friday seed server',
      id: 'srv_4f2a9c',
      proto: '1',
      ap: '0.6.8',
      open: '1',
    });
    expect(buildDiscoveryTxt({ ...record, open: false }).open).toBe('0');
  });

  test('a record survives a round trip', () => {
    expect(parseDiscoveryTxt(buildDiscoveryTxt(record))).toEqual({ ok: true, record, compatible: true });
    expect(parseDiscoveryTxt(buildDiscoveryTxt({ ...record, open: false }))).toMatchObject({
      ok: true,
      record: { open: false },
    });
  });

  test('an unknown protocol version parses and is marked incompatible', () => {
    const outcome = parseDiscoveryTxt({ ...buildDiscoveryTxt(record), proto: '7' });
    expect(outcome).toMatchObject({ ok: true, compatible: false, record: { protocol: 7 } });
  });

  test.each<[string, string | undefined]>([
    ['name', undefined],
    ['id', 'x'],
    ['proto', 'one'],
    ['proto', '0'],
    ['ap', '0.6'],
    ['open', 'yes'],
  ])('a bad %s value (%s) is malformed', (key, value) => {
    const txt: Record<string, string | undefined> = { ...buildDiscoveryTxt(record), [key]: value };
    expect(parseDiscoveryTxt(txt)).toMatchObject({ ok: false, reason: 'malformed' });
  });

  test('a TXT value over 255 bytes is refused', () => {
    const txt = { ...buildDiscoveryTxt(record), name: 'n'.repeat(256) };
    expect(parseDiscoveryTxt(txt)).toMatchObject({ ok: false, reason: 'too-large' });
  });
});

describe('UDP beacon', () => {
  test('a beacon is a small JSON object with the same fields and a port', () => {
    const text = buildBeacon(beacon);
    expect(JSON.parse(text)).toEqual({
      app: 'archipelia',
      name: 'Friday seed server',
      id: 'srv_4f2a9c',
      protocol: 1,
      ap: '0.6.8',
      open: true,
      port: 38290,
    });
    expect(new TextEncoder().encode(text).length).toBeLessThanOrEqual(BEACON_MAX_BYTES);
  });

  test('a beacon survives a round trip as text and as bytes', () => {
    const text = buildBeacon(beacon);
    expect(parseBeacon(text)).toEqual({ ok: true, record: beacon, compatible: true });
    expect(parseBeacon(new TextEncoder().encode(text))).toMatchObject({ ok: true, record: beacon });
  });

  test('an unknown protocol version parses and is marked incompatible', () => {
    const text = JSON.stringify({ ...JSON.parse(buildBeacon(beacon)), protocol: 2 });
    expect(parseBeacon(text)).toMatchObject({ ok: true, compatible: false });
  });

  test('a datagram over the size limit is refused before it is parsed', () => {
    const big = JSON.stringify({ ...JSON.parse(buildBeacon(beacon)), pad: 'x'.repeat(BEACON_MAX_BYTES) });
    expect(parseBeacon(big)).toMatchObject({ ok: false, reason: 'too-large' });
    expect(parseBeacon(new Uint8Array(BEACON_MAX_BYTES + 1))).toMatchObject({ ok: false, reason: 'too-large' });
  });

  test('the builder refuses to make an oversize beacon', () => {
    const wide = { ...beacon, id: 'i'.repeat(600) };
    expect(() => buildBeacon(wide)).toThrow('larger than 512 bytes');
  });

  test('other traffic on the port is told apart', () => {
    expect(parseBeacon('hello')).toMatchObject({ ok: false, reason: 'not-json' });
    expect(parseBeacon('[1]')).toMatchObject({ ok: false, reason: 'not-json' });
    expect(parseBeacon('{"app":"other"}')).toMatchObject({ ok: false, reason: 'wrong-app' });
  });

  test('a beacon with a missing or bad field is malformed', () => {
    const base = JSON.parse(buildBeacon(beacon)) as Record<string, unknown>;
    for (const change of [{ port: undefined }, { port: 0 }, { port: 70000 }, { open: 'yes' }, { ap: 'latest' }]) {
      expect(parseBeacon(JSON.stringify({ ...base, ...change })), JSON.stringify(change)).toMatchObject({
        ok: false,
        reason: 'malformed',
      });
    }
  });
});
