/* @layer tests @kind test */
import { afterEach, describe, expect, test } from 'vitest';
import type { Lobby, MemberYaml } from '@archipelia/model';
import { startLobbyRig } from '../../src/testing';

type Rig = Awaited<ReturnType<typeof startLobbyRig>>;

const ENGINE = { id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.0' };

const YAML = ['name: Ana', 'game: A Link to the Past', 'A Link to the Past:', '  goal: ganon', ''].join('\n');

let rig: Rig | undefined;

afterEach(async () => {
  await rig?.stop();
  rig = undefined;
});

describe('K2 the member.yaml admin request', { tags: ['e2e'] }, () => {
  test('gives the host the player file of each slot of a member, read only', async () => {
    rig = await startLobbyRig();
    const lobby = (await rig.call('lobby.create', { name: 'Sunday run', engine: ENGINE })) as Lobby;
    const hosted = (await rig.call('member.host', { lobbyId: lobby.id, displayName: 'Host', slots: [{ name: 'Ana', game: 'A Link to the Past', yaml: YAML, worldVersion: '1.0.0' }] })) as Lobby;
    const memberId = hosted.members.find((member) => member.displayName === 'Host')?.id ?? '';
    const sent = (await rig.call('member.yaml', { lobbyId: lobby.id, memberId })) as MemberYaml;
    expect(sent).toEqual({ memberId, slots: [{ name: 'Ana', game: 'A Link to the Past', yaml: YAML }] });
  });

  test('refuses a lobby or a player it does not know', async () => {
    rig = await startLobbyRig();
    const lobby = (await rig.call('lobby.create', { name: 'Sunday run', engine: ENGINE })) as Lobby;
    await expect(rig.call('member.yaml', { lobbyId: 'lb_missing', memberId: 'm_1' })).rejects.toThrow('no lobby');
    await expect(rig.call('member.yaml', { lobbyId: lobby.id, memberId: 'm_9' })).rejects.toThrow('no player');
  });
});
