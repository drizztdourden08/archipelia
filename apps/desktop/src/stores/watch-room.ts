/* @layer renderer-app @kind logic */
import { slotTypes } from 'archipelago.js';
import type { API, Client } from 'archipelago.js';
import type { HintLookup, ProtocolHint, RoomPlayer, WatchedChecks } from '@archipelia/sessions/live-room';
import { HINTS_KEY_PREFIX, STATUS_KEY_PREFIX, asHints, hintRows, hintsKey, statusKey } from '@archipelia/sessions/live-room';
import { NO_RETRY } from './live-room-store.constants';
import type { LiveRoomSet } from './live-room-store.type';

const lookupOf = (room: Client): HintLookup => ({
  playerName: (slot) => room.players.slots[slot]?.name ?? `Slot ${slot}`,
  gameOf: (slot) => room.players.slots[slot]?.game ?? '',
  itemName: (game, id) => room.package.lookupItemName(game, id),
  locationName: (game, id) => room.package.lookupLocationName(game, id),
});

const roomPlayers = (room: Client): RoomPlayer[] => {
  const { team } = room.players.self;
  return Object.entries(room.players.slots)
    .filter(([, info]) => info.type === slotTypes.player)
    .map(([slot, info]) => ({ team, slot: Number(slot), name: info.name, game: info.game }))
    .sort((a, b) => a.slot - b.slot);
};

const watchedOf = (room: Client): WatchedChecks => ({
  team: room.players.self.team,
  slot: room.players.self.slot,
  checked: room.room.checkedLocations.length,
  total: room.room.allLocations.length,
});

const watchRoom = async (room: Client, set: LiveRoomSet, current: () => boolean, onLost: () => void): Promise<void> => {
  let hintLists: Record<string, ProtocolHint[]> = {};
  const applyKey = (key: string, value: unknown) => {
    if (key.startsWith(STATUS_KEY_PREFIX)) set((s) => ({ statuses: { ...s.statuses, [key]: value } }));
    if (key.startsWith(HINTS_KEY_PREFIX)) {
      hintLists = { ...hintLists, [key]: asHints(value) };
      set({ hints: hintRows(Object.values(hintLists), lookupOf(room)) });
    }
  };
  const players = roomPlayers(room);
  set({ phase: 'live', error: null, players, watched: watchedOf(room), passwordRequired: room.room.password, ...NO_RETRY });
  room.room.on('locationsChecked', () => { if (current()) set({ watched: watchedOf(room) }); });
  room.socket.on('disconnected', () => { if (current()) onLost(); });
  const keys = players.flatMap((p) => [statusKey(p.team, p.slot), hintsKey(p.team, p.slot)]);
  const onChange = (key: string, value: API.JSONSerializable) => { if (current()) applyKey(key, value); };
  const initial = await room.storage.notify<API.JSONRecord>(keys, onChange);
  if (current()) Object.entries(initial).forEach(([key, value]) => applyKey(key, value));
};

export { watchRoom };
