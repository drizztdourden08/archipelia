/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { isNetworkMode, NETWORK_MODES, wantsDiscovery, wantsPortMapping } from '../../src/network';

describe('K1 the network mode', { tags: ['critical'] }, () => {
  test('recognizes only the known modes', () => {
    expect(isNetworkMode('lan')).toBe(true);
    expect(isNetworkMode('internet')).toBe(false);
    expect(isNetworkMode(undefined)).toBe(false);
  });

  test('runs discovery for the LAN modes and port mapping for LAN and internet only', () => {
    expect(NETWORK_MODES.map(wantsDiscovery)).toEqual([true, true, false]);
    expect(NETWORK_MODES.map(wantsPortMapping)).toEqual([false, true, false]);
  });
});
