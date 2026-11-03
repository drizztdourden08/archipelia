/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { createLobbyService } from '../../src/lobby/create-lobby-service';
import { fakeTrust, testDeps } from '../../src/testing';
import { engine, startService } from './security-kit';

const ROOM = { seed: '1', zip: 'z', host: 'h', port: 1, tls: 'no', files: [], state: 'hosting' } as const;

const startCommandService = async () => {
  const kit = await startService();
  const sent: { sessionId: string; line: string }[] = [];
  const base = testDeps({ store: kit.store, output: kit.domains.domain('sessions'), root: kit.dataDir, trust: fakeTrust('active'), run: () => Promise.reject(new Error('none')) });
  const service = createLobbyService({ ...base, runner: { ...base.runner, command: (sessionId, line) => Promise.resolve(void sent.push({ sessionId, line })) } });
  return { kit, sent, service };
};

describe('K4 room.command reaches the room of a lobby', { tags: ['critical'] }, () => {
  test('sends the line to the running room of the lobby', async () => {
    const { kit, sent, service } = await startCommandService();
    const lobby = await service.create({ name: 'Friday', engine });
    const held = await service.get(lobby.id);
    Object.assign(held ?? {}, { phase: 'hosting', sessionId: 's1', room: ROOM });
    const result = await service.sendRoomCommand(lobby.id, '/send Ana Hookshot');
    expect(sent).toEqual([{ sessionId: 's1', line: '/send Ana Hookshot' }]);
    expect(result.id).toBe(lobby.id);
    await kit.stop();
  });

  test('refuses a lobby with no running room, an unknown lobby, and a bad line', async () => {
    const { kit, sent, service } = await startCommandService();
    const lobby = await service.create({ name: 'Friday', engine });
    await expect(service.sendRoomCommand(lobby.id, '/players')).rejects.toThrow('no running room');
    await expect(service.sendRoomCommand('missing', '/players')).rejects.toThrow('no running room');
    const held = await service.get(lobby.id);
    Object.assign(held ?? {}, { phase: 'hosting', sessionId: 's1', room: ROOM });
    await expect(service.sendRoomCommand(lobby.id, '   ')).rejects.toThrow('1 to 500 characters');
    await expect(service.sendRoomCommand(lobby.id, `/say ${'x'.repeat(500)}`)).rejects.toThrow('1 to 500 characters');
    await expect(service.sendRoomCommand(lobby.id, '/a\n/b')).rejects.toThrow('one line');
    expect(sent).toEqual([]);
    await kit.stop();
  });
});
