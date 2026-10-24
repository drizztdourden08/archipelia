/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { DEFAULT_NETWORK_MODE, isNetworkMode, NETWORK_MODES, wantsDiscovery, wantsPortMapping } from '../../src/network';

describe('the network mode', () => {
  test('knows the three modes and defaults to LAN only', () => {
    expect([...NETWORK_MODES]).toEqual(['lan', 'lan-and-internet', 'off']);
    expect(DEFAULT_NETWORK_MODE).toBe('lan');
    expect(isNetworkMode('lan')).toBe(true);
    expect(isNetworkMode('internet')).toBe(false);
    expect(isNetworkMode(undefined)).toBe(false);
  });

  test('runs discovery for the LAN modes and port mapping for LAN and internet only', () => {
    expect(NETWORK_MODES.map(wantsDiscovery)).toEqual([true, true, false]);
    expect(NETWORK_MODES.map(wantsPortMapping)).toEqual([false, true, false]);
  });
});
