/* @layer renderer-app @kind logic */
import type { API, Client } from 'archipelago.js';
import type { RoomNames, RoomPlayer } from '@archipelia/sessions/live-room';
import { groupKeyOf, groupNamesOf } from './group-names-of';

const plainNamesOf = (room: Client, games: ReadonlySet<string>): Record<string, { items: string[]; locations: string[] }> =>
  Object.fromEntries(
    Object.entries(room.package.exportPackage().games)
      .filter(([game]) => games.has(game))
      .map(([game, data]) => [game, { items: Object.keys(data.item_name_to_id), locations: Object.keys(data.location_name_to_id) }]),
  );

const roomNamesOf = async (room: Client, players: readonly RoomPlayer[]): Promise<RoomNames> => {
  const games = new Set(players.map((player) => player.game));
  const plain = plainNamesOf(room, games);
  const keys = [...games].flatMap((game) => [groupKeyOf('item', game), groupKeyOf('location', game)]);
  const groups = await room.storage.fetch<API.JSONRecord>(keys).catch(() => ({}));
  return Object.fromEntries(
    Object.entries(plain).map(([game, names]) => [game, {
      items: [...new Set([...names.items, ...groupNamesOf(groups[groupKeyOf('item', game)])])],
      locations: [...new Set([...names.locations, ...groupNamesOf(groups[groupKeyOf('location', game)])])],
    }]),
  );
};

export { roomNamesOf };
