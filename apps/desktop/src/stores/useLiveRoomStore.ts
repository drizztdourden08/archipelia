/* @layer renderer-app @kind hook */
import { Client, LoginError, itemsHandlingFlags, slotTypes } from 'archipelago.js';
import type { API } from 'archipelago.js';
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { HintLookup, LiveRoomTarget, ProtocolHint, RoomPlayer, WatchedChecks } from '@archipelia/sessions/live-room';
import { HINTS_KEY_PREFIX, STATUS_KEY_PREFIX, asHints, hintRows, hintsKey, statusKey } from '@archipelia/sessions/live-room';
import { IDLE, TRACKER_TAGS } from './live-room-store.constants';
import type { LiveRoomData, LiveRoomState } from './live-room-store.type';

let client: Client | null = null;

let generation = 0;

let hintLists: Record<string, ProtocolHint[]> = {};

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

const loginFirst = async (room: Client, target: LiveRoomTarget, password: string) => {
  let lastError: unknown = new Error('No address to watch');
  for (const url of target.urls) {
    try {
      await room.login(url, target.slotName, '', { tags: TRACKER_TAGS, password, items: itemsHandlingFlags.minimal, slotData: false });
      return;
    } catch (error) {
      if (error instanceof LoginError) throw error;
      lastError = error;
    }
  }
  throw lastError;
};

const refusalOf = (error: unknown, password: string): Partial<LiveRoomData> => {
  if (error instanceof LoginError && error.errors.includes('InvalidPassword')) {
    return { phase: 'password', passwordRequired: true, error: password ? 'Wrong password' : null };
  }
  const reason = error instanceof LoginError ? error.errors.join(', ') : (error as Error).message;
  return { phase: 'failed', error: reason || 'The room did not answer' };
};

const useLiveRoomStore = createSessionStore<LiveRoomState>((set) => {
  const current = (gen: number) => gen === generation;

  const applyKey = (room: Client, key: string, value: unknown) => {
    if (key.startsWith(STATUS_KEY_PREFIX)) set((s) => ({ statuses: { ...s.statuses, [key]: value } }));
    if (key.startsWith(HINTS_KEY_PREFIX)) {
      hintLists = { ...hintLists, [key]: asHints(value) };
      set({ hints: hintRows(Object.values(hintLists), lookupOf(room)) });
    }
  };

  const watch = async (room: Client, gen: number) => {
    const players = roomPlayers(room);
    set({ phase: 'live', error: null, players, watched: watchedOf(room), passwordRequired: room.room.password });
    room.room.on('locationsChecked', () => { if (current(gen)) set({ watched: watchedOf(room) }); });
    room.socket.on('disconnected', () => { if (current(gen)) set({ phase: 'closed' }); });
    const keys = players.flatMap((p) => [statusKey(p.team, p.slot), hintsKey(p.team, p.slot)]);
    const onChange = (key: string, value: API.JSONSerializable) => { if (current(gen)) applyKey(room, key, value); };
    const initial = await room.storage.notify<API.JSONRecord>(keys, onChange);
    if (current(gen)) Object.entries(initial).forEach(([key, value]) => applyKey(room, key, value));
  };

  const disconnect = () => {
    generation += 1;
    client?.socket.disconnect();
    client = null;
    hintLists = {};
    set(IDLE);
  };

  const connect = async (target: LiveRoomTarget, password = '') => {
    disconnect();
    const gen = generation;
    const room = new Client();
    client = room;
    set({ sessionId: target.sessionId, phase: 'connecting' });
    try {
      await loginFirst(room, target, password);
      if (current(gen)) await watch(room, gen);
    } catch (error) {
      room.socket.disconnect();
      if (current(gen)) set(refusalOf(error, password));
    }
  };

  return { ...IDLE, connect, disconnect };
});

export { useLiveRoomStore };
