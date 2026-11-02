/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { seatsLeftOut } from '../../src/lobbies/seats-left-out';
import { leftOutOptions } from '../../src/views/SessionLobby/behavior/left-out-options';
import { lobby, member, slot } from './lobby-fixtures';

describe('the seats a run would leave out', () => {
  test('names the not ready seats of approved players with the reason', () => {
    const waiting = member({ admission: 'approved', displayName: 'Ana', slots: [slot({ name: 'Ana-Quest', state: 'waiting-consent' }), slot({ name: 'Ana-Two' })] });
    const checking = member({ id: 'm_2', admission: 'approved', displayName: 'Bo', slots: [slot({ name: 'Bo-Quest', state: 'checking' })] });
    expect(seatsLeftOut(lobby({ members: [waiting, checking] }))).toEqual([
      { player: 'Ana', seat: 'Ana-Quest', state: 'waiting-consent', reason: 'Needs your consent' },
      { player: 'Bo', seat: 'Bo-Quest', state: 'checking', reason: 'Checking' },
    ]);
  });

  test('is empty when every approved seat is ready, a player is not approved, or the lobby is missing', () => {
    const pending = member({ admission: 'pending', slots: [slot({ state: 'waiting-consent' })] });
    expect(seatsLeftOut(lobby({ members: [member({ admission: 'approved' }), pending] }))).toEqual([]);
    expect(seatsLeftOut(undefined)).toEqual([]);
  });

  test('builds a confirm that offers Run without them and Cancel', () => {
    const options = leftOutOptions([{ player: 'Ana', seat: 'Ana-Quest', state: 'waiting-consent', reason: 'Needs your consent' }]);
    expect(options).toMatchObject({ confirmLabel: 'Run without them', cancelLabel: 'Cancel' });
    expect(options.facts).toEqual([{ label: 'Ana-Quest (Ana)', value: 'Needs your consent' }]);
  });
});
