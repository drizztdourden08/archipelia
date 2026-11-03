/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { engine, helloOf, linkOf, startService } from './security-kit';

const infoRequest = { type: 'lobby.info' as const, protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: { code: 'K7QM-4XT2' } };

const openOf = async (kit: Awaited<ReturnType<typeof startService>>) => {
  const reply = await kit.service.protocol.info(infoRequest);
  if (!reply.ok) throw new Error(reply.failure.message);
  return reply.value.lobby;
};

describe('K1 open seats and allowed games', { tags: ['critical'] }, () => {
  test('the info reply counts the open seats, and a join with no seat takes one', async () => {
    const kit = await startService();
    await kit.service.create({ name: 'Open', engine, options: { admission: 'host-approval' }, openSeats: 2 });
    expect((await openOf(kit)).open).toEqual({ total: 2, free: 2 });
    const joined = await kit.service.protocol.join(helloOf(), linkOf().link);
    expect(joined.ok).toBe(true);
    expect((await openOf(kit)).open).toEqual({ total: 2, free: 1 });
    await kit.stop();
  });

  test('a lobby with no open seat and no allowed games leaves both fields out', async () => {
    const kit = await startService();
    await kit.service.create({ name: 'Bare', engine });
    const lobby = await openOf(kit);
    expect(lobby.open).toBeUndefined();
    expect(lobby.allowedGames).toBeUndefined();
    await kit.stop();
  });

  test('a slot whose game is not listed is refused with game-not-allowed on the field of the slot', async () => {
    const kit = await startService();
    await kit.service.create({ name: 'Games', engine, options: { allowedGames: ['Hollow Knight'] }, openSeats: 1 });
    expect((await openOf(kit)).allowedGames).toEqual(['Hollow Knight']);
    const outcome = await kit.service.protocol.join(helloOf(), linkOf().link);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'game-not-allowed', field: 'slots[0].game', slot: 'Link' } });
    await kit.stop();
  });

  test('a listed game, in any case, is let in', async () => {
    const kit = await startService();
    await kit.service.create({ name: 'Games', engine, options: { allowedGames: ['relic of the past'] }, openSeats: 1 });
    expect((await kit.service.protocol.join(helloOf(), linkOf().link)).ok).toBe(true);
    await kit.stop();
  });
});
