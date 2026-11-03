/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { DirectConnection } from '@archipelia/model';
import { sessionLobby } from '../../src/lobbies/session-lobby';
import { directState } from '../../src/views/SessionBuilder/behavior/direct-state';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';

const door: DirectConnection = { admission: 'host-approval', allowUnlisted: false, allowedGames: [] };

describe('K1 a lobby with direct connections is shown on the network by default', { tags: ['critical'] }, () => {
  const local = newTemplate('t1');

  test('direct connections with no choice made list the lobby', () => {
    expect(sessionLobby({ ...local, direct: door }).options.listed).toBe(true);
    expect(directState({ ...local, direct: door }, false, false).listed).toBe(true);
  });

  test('the host can still turn it off', () => {
    expect(sessionLobby({ ...local, direct: { ...door, listed: false } }).options.listed).toBe(false);
    expect(directState({ ...local, direct: { ...door, listed: false } }, false, false).listed).toBe(false);
  });

  test('no direct connections means nothing is listed', () => {
    expect(sessionLobby({ ...local, direct: undefined }).options.listed).toBe(false);
  });
});
