/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { localAddress } from '../../src/lobby/start/local-address';

describe('the loopback address of a room', () => {
  test('is offered when the room runs on the computer of the server', () => {
    expect(localAddress({ kind: 'local', port: 38281 }, { port: 38281 })).toBe('127.0.0.1:38281');
  });

  test('is not offered for a remote machine or a website', () => {
    expect(localAddress({ kind: 'remote', serverId: 's1' }, { port: 38281 })).toBeNull();
    expect(localAddress({ kind: 'archipelago-gg' }, { port: 38281 })).toBeNull();
  });
});
