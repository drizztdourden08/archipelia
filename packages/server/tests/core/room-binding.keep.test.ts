/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { roomBinding } from '../../src/core/room-binding';

const network = (automation: boolean) => ({ automation, lanHost: () => '192.168.1.20' });

describe('where the room of a lobby binds', () => {
  test('a private lobby server hosts its room on the loopback only, and advertises it', () => {
    const binding = roomBinding('off', network(false));
    expect(binding.bindHost).toBe('127.0.0.1');
    expect(binding.advertiseHost()).toBe('127.0.0.1');
  });

  test('a lobby server on the network or the internet hosts its room on every interface', () => {
    for (const mode of ['lan', 'lan-and-internet'] as const) {
      const binding = roomBinding(mode, network(false));
      expect(binding.bindHost).toBe('0.0.0.0');
      expect(binding.advertiseHost()).toBe('192.168.1.20');
    }
  });

  test('an automated launch keeps the loopback in every mode', () => {
    expect(roomBinding('lan', network(true)).bindHost).toBe('127.0.0.1');
  });
});
