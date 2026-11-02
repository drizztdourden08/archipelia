/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Hello } from '@drizztdourden08/archipelia-lobby-protocol';
import { engine, fileOf, helloOf, linkOf, startService } from './security-kit';

const infoRequest = { type: 'lobby.info' as const, protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: { code: 'K7QM-4XT2' } };

const otherHello = (name: string, seat?: string): Hello => {
  const yaml = fileOf('Y2');
  return helloOf({ player: { displayName: name }, ...(seat ? { seat } : {}), slots: [{ name, game: 'Relic of the Past', yaml: { sha256: yaml.sha256, size: yaml.bytes.length } }] });
};

const startSeated = async (seats: string[] = ['Alice', 'Bob']) => {
  const kit = await startService();
  const lobby = await kit.service.create({ name: 'Seats', engine, options: { admission: 'host-approval' }, seats });
  return { kit, lobby };
};

const seatsOfInfo = async (kit: Awaited<ReturnType<typeof startService>>) => {
  const reply = await kit.service.protocol.info(infoRequest);
  if (!reply.ok) throw new Error(reply.failure.message);
  return reply.value.lobby.seats;
};

describe('K1 held seats a joining client can pick', { tags: ['critical'] }, () => {
  test('the info reply lists the held seats, free at first, and leaves the field out when none is held', async () => {
    const { kit } = await startSeated();
    expect(await seatsOfInfo(kit)).toEqual([{ name: 'Alice', free: true }, { name: 'Bob', free: true }]);
    await kit.stop();
    const bare = await startService();
    await bare.service.create({ name: 'Bare', engine });
    expect(await seatsOfInfo(bare)).toBeUndefined();
    await bare.stop();
  });

  test('a seat choice is kept in the spelling of the lobby, stays pending, and marks the seat taken', async () => {
    const { kit, lobby } = await startSeated();
    const joined = await kit.service.protocol.join(helloOf({ seat: 'alice' }), linkOf().link);
    if (!joined.ok) throw new Error(joined.failure.message);
    const member = (await kit.service.get(lobby.id))?.members.find((entry) => entry.id === joined.value.memberId);
    expect(member).toMatchObject({ seat: 'Alice', admission: 'pending' });
    expect(await seatsOfInfo(kit)).toEqual([{ name: 'Alice', free: false }, { name: 'Bob', free: true }]);
    await kit.service.approve(lobby.id, joined.value.memberId);
    expect((await kit.service.get(lobby.id))?.members.find((entry) => entry.id === joined.value.memberId)).toMatchObject({ seat: 'Alice', admission: 'approved' });
    await kit.stop();
  });

  test('a seat the lobby does not hold is refused with seat-unavailable on the field seat', async () => {
    const { kit } = await startSeated();
    const outcome = await kit.service.protocol.join(helloOf({ seat: 'Ghost' }), linkOf().link);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'seat-unavailable', field: 'seat', message: 'This lobby holds no seat named Ghost.' } });
    await kit.stop();
  });

  test('a seat that another member took is refused, and a refused member frees it again', async () => {
    const { kit, lobby } = await startSeated();
    const first = await kit.service.protocol.join(helloOf({ seat: 'Bob' }), linkOf().link);
    if (!first.ok) throw new Error(first.failure.message);
    const second = await kit.service.protocol.join(otherHello('Other', 'BOB'), linkOf().link);
    expect(second).toMatchObject({ ok: false, failure: { code: 'seat-unavailable', field: 'seat', message: 'The seat Bob is already taken.' } });
    await kit.service.refuse(lobby.id, first.value.memberId, 'No');
    const retry = await kit.service.protocol.join(otherHello('Other', 'Bob'), linkOf().link);
    expect(retry.ok).toBe(true);
    await kit.stop();
  });

  test('a client that sends no seat joins as before, and a display name equal to a seat takes that seat', async () => {
    const { kit } = await startSeated();
    const plain = await kit.service.protocol.join(otherHello('Alice'), linkOf().link);
    expect(plain.ok).toBe(true);
    expect(await seatsOfInfo(kit)).toEqual([{ name: 'Alice', free: false }, { name: 'Bob', free: true }]);
    await kit.stop();
  });

  test('the host can change the held seats of an open lobby', async () => {
    const { kit, lobby } = await startSeated();
    await kit.service.update(lobby.id, { seats: ['Zed'] });
    expect(await seatsOfInfo(kit)).toEqual([{ name: 'Zed', free: true }]);
    await kit.stop();
  });
});
