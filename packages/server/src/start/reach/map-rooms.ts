/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import { mapPort } from '../../network';
import { MAP_TTL_S } from './reach.constants';
import type { ReachInput, RoomMapping } from './reach.type';

const hostsLocally = (lobby: Lobby) => lobby.phase === 'hosting' && lobby.room?.state === 'hosting' && lobby.options.room.kind === 'local';

const mapRooms = (input: ReachInput, messages: Record<string, string>, blocked: Record<string, string>) => {
  const rooms = new Map<string, RoomMapping>();
  const release = (lobbyId: string) => {
    const mapping = rooms.get(lobbyId);
    rooms.delete(lobbyId);
    delete messages[lobbyId];
    delete blocked[lobbyId];
    void mapping?.result.then((result) => result.stop());
  };
  const follow = (lobby: Lobby) => {
    if (!hostsLocally(lobby) || !lobby.room) return release(lobby.id);
    if (rooms.get(lobby.id)?.port === lobby.room.port) return undefined;
    release(lobby.id);
    const result = mapPort({ port: lobby.room.port, protocol: 'tcp', ttl: MAP_TTL_S, automation: input.automation, ports: input.ports.mapping, description: `Archipelia room ${lobby.name}` });
    rooms.set(lobby.id, { port: lobby.room.port, result });
    void result.then((done) => {
      messages[lobby.id] = done.message;
      if (!done.ok && done.reason === 'cgnat') blocked[lobby.id] = done.message;
      input.log(`room of ${lobby.name}: ${done.message}`);
    });
    return undefined;
  };
  const stop = async () => {
    const pending = [...rooms.values()];
    rooms.clear();
    await Promise.all(pending.map(async (mapping) => (await mapping.result).stop()));
  };
  return { follow, stop };
};

export { mapRooms };
