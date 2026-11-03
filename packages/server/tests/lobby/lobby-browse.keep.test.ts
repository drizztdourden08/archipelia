/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Hello, LobbyBrowseRequest } from '@drizztdourden08/archipelia-lobby-protocol';
import { engine, fileOf, helloOf, linkOf, startService } from './security-kit';

type Kit = Awaited<ReturnType<typeof startService>>;

const browseRequest: LobbyBrowseRequest = { type: 'lobby.browse', seq: 1, protocol: { name: 'archipelia-lobby', versions: [1] } };

const browse = async (kit: Kit) => {
  const reply = await kit.service.protocol.browse(browseRequest);
  if (!reply.ok) throw new Error(reply.failure.message);
  return reply.value.lobbies;
};

const byToken = (joinToken: string, patch: Partial<Hello> = {}): Hello => helloOf({ lobby: { joinToken }, ...patch });

const unlistedClient = (): Partial<Hello> => {
  const world = fileOf('U');
  const yaml = fileOf('UY');
  return {
    client: { id: 'quest-client', name: 'Quest Client', version: '1.4.2', platform: { os: 'linux', arch: 'x64' } },
    worlds: [{ game: 'Unlisted Quest', module: 'unlisted_quest', worldVersion: '1.0.0', sha256: world.sha256, size: world.bytes.length }],
    slots: [{ name: 'Zelda', game: 'Unlisted Quest', yaml: { sha256: yaml.sha256, size: yaml.bytes.length } }],
  };
};

const tokenOf = async (kit: Kit): Promise<string> => {
  const [listed] = await browse(kit);
  if (!listed) throw new Error('no lobby is listed');
  return listed.joinToken;
};

describe('K1 listing the lobbies of a server', { tags: ['critical'] }, () => {
  test('a lobby is hidden by default and has no join token', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Quiet', engine });
    expect(lobby.joinToken).toBeUndefined();
    expect(await browse(kit)).toEqual([]);
    await kit.stop();
  });

  test('a shown open lobby is listed with its seats, rules, engine and a random join token', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Friday seed', engine, options: { listed: true, maxSlots: 4 } });
    const lobbies = await browse(kit);
    expect(lobbies).toEqual([
      { name: 'Friday seed', joinToken: lobby.joinToken, engine: { ap: '0.6.8' }, admission: 'host-approval', allowUnlisted: false, joinable: true, seats: { total: 4, free: 4 } },
    ]);
    expect(lobby.joinToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(lobby.joinToken).not.toContain(lobby.code);
    await kit.stop();
  });

  test('a locked lobby is not listed', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Locked', engine, options: { listed: true } });
    await kit.service.lock(lobby.id);
    expect(await browse(kit)).toEqual([]);
    await kit.stop();
  });

  test('a join by token goes through the approval rule like a join by code', async () => {
    const kit = await startService();
    await kit.service.create({ name: 'Approval', engine, options: { listed: true, admission: 'host-approval' } });
    const { link, sent } = linkOf();
    const joined = await kit.service.protocol.join(byToken(await tokenOf(kit)), link);
    expect(joined.ok).toBe(true);
    expect(sent.find((message) => message.type === 'welcome')).toMatchObject({ member: { admission: 'pending' } });
    await kit.stop();
  });

  test('a join by token refuses an unlisted client when the lobby takes listed clients only', async () => {
    const kit = await startService();
    await kit.service.create({ name: 'Listed only', engine, options: { listed: true, allowUnlisted: false } });
    const outcome = await kit.service.protocol.join(byToken(await tokenOf(kit), unlistedClient()), linkOf().link);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'unlisted-not-allowed' } });
    await kit.stop();
  });

  test('hiding a lobby drops it from the list and its token stops working', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Hidden', engine, options: { listed: true } });
    const token = await tokenOf(kit);
    const hidden = await kit.service.update(lobby.id, { options: { listed: false } });
    expect(hidden.joinToken).toBeUndefined();
    expect(await browse(kit)).toEqual([]);
    const outcome = await kit.service.protocol.join(byToken(token), linkOf().link);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'lobby-not-found', field: 'lobby.joinToken' } });
    const info = await kit.service.protocol.info({ type: 'lobby.info', protocol: browseRequest.protocol, lobby: { joinToken: token } });
    expect(info).toMatchObject({ ok: false, failure: { code: 'lobby-not-found' } });
    await kit.stop();
  });

  test('showing a lobby again gives it a new token, and an update that keeps it shown keeps the token', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Again', engine, options: { listed: true } });
    const renamed = await kit.service.update(lobby.id, { name: 'Again and again' });
    expect(renamed.joinToken).toBe(lobby.joinToken);
    await kit.service.update(lobby.id, { options: { listed: false } });
    const shown = await kit.service.update(lobby.id, { options: { listed: true } });
    expect(shown.joinToken).toBeDefined();
    expect(shown.joinToken).not.toBe(lobby.joinToken);
    await kit.stop();
  });

  test('rotating the token makes the old one fail and the new one work', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Rotate', engine, options: { listed: true, admission: 'open' } });
    const old = await tokenOf(kit);
    const rotated = await kit.service.rotateJoinToken(lobby.id);
    expect(rotated.joinToken).not.toBe(old);
    expect(await kit.service.protocol.join(byToken(old), linkOf().link)).toMatchObject({ ok: false, failure: { code: 'lobby-not-found' } });
    expect((await kit.service.protocol.join(byToken(await tokenOf(kit)), linkOf().link)).ok).toBe(true);
    await kit.stop();
  });

  test('a hidden lobby has no token to rotate', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Quiet', engine });
    await expect(kit.service.rotateJoinToken(lobby.id)).rejects.toThrow('not shown on the network');
    await kit.stop();
  });
});
