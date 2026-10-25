/* @layer tests @kind test */
import { afterEach, describe, expect, test } from 'vitest';
import { probeLobby } from '../../electron/lobbies/join/probe-lobby';
import { ENGINE, startFixture } from './admin-fixture';

type Fixture = Awaited<ReturnType<typeof startFixture>>;

const running: Fixture[] = [];

afterEach(async () => {
  await Promise.all(running.splice(0).map((fixture) => fixture.stop()));
});

const withLobby = async () => {
  const fixture = await startFixture();
  running.push(fixture);
  const lobby = await fixture.started.core.lobbies.create({
    name: 'Friday seed', engine: ENGINE, options: { admission: 'open', maxSlots: 4, room: { kind: 'archipelago-gg' } },
  });
  return { address: `127.0.0.1:${fixture.endpoint.port}`, code: lobby.code };
};

describe('looking at a lobby from its address and code', () => {
  test('shows the name, the Archipelago version and that the lobby is open', async () => {
    const { address, code } = await withLobby();
    expect(await probeLobby(address, code)).toMatchObject({ ok: true, name: 'Friday seed', ap: '0.6.8', phase: 'open', joinable: true, admission: 'open' });
  });

  test('accepts the code written with the dash and in lower case', async () => {
    const { address, code } = await withLobby();
    const written = `${code.slice(0, 4)}-${code.slice(4)}`.toLowerCase();
    expect(await probeLobby(address, written)).toMatchObject({ ok: true, name: 'Friday seed' });
  });

  test('says so plainly for a wrong code, a bad code and a bad address', async () => {
    const { address } = await withLobby();
    expect((await probeLobby(address, 'AAAA-AAAA')).ok).toBe(false);
    expect(await probeLobby(address, 'nope')).toMatchObject({ ok: false, message: expect.stringContaining('8 letters') as string });
    expect(await probeLobby('', 'AAAA-AAAA')).toMatchObject({ ok: false });
    expect(await probeLobby('ws://play.example.net:38290', 'AAAA-AAAA')).toMatchObject({ ok: false });
  });
});
