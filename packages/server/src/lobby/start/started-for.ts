/* @layer core @kind logic */
import type { LobbyStarted } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby, LobbyRoom, SlotUpload } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { localAddress } from './local-address';

const slotResult = (room: LobbyRoom, slot: SlotUpload) => ({
  name: slot.name,
  game: slot.game,
  team: 0,
  files: room.files.filter((file) => file.slot === slot.name).map(({ fileId, name, size, sha256 }) => ({ fileId, name, size, sha256 })),
});

const playingSlots = (lobby: Lobby, memberId: string): SlotUpload[] => {
  const member = lobby.members.find((candidate) => candidate.id === memberId);
  if (lobby.phase !== 'hosting' || lobby.room?.state !== 'hosting' || member?.admission !== 'approved') return [];
  return member.slots.filter((slot) => slot.state === 'ok');
};

const roomInfo = async (ctx: LobbyContext, lobby: Lobby, room: LobbyRoom): Promise<LobbyStarted['room']> => {
  const password = room.passwordRef ? await ctx.deps.secrets.get(room.passwordRef) : null;
  const local = localAddress(lobby.options.room, room);
  return {
    address: `${room.host}:${room.port}`, host: room.host, port: room.port, tls: room.tls,
    ...(password ? { password } : {}), ...(room.roomUrl ? { roomUrl: room.roomUrl } : {}),
    ...(local ? { localAddress: local } : {}),
  };
};

const startedFor = async (ctx: LobbyContext, lobby: Lobby, memberId: string): Promise<LobbyStarted | null> => {
  const { room } = lobby;
  const slots = playingSlots(lobby, memberId);
  if (!room || slots.length === 0) return null;
  return {
    type: 'lobby.started',
    seed: room.seed,
    engine: { ap: lobby.engine.ap },
    room: await roomInfo(ctx, lobby, room),
    slots: slots.map((slot) => slotResult(room, slot)),
  };
};

export { startedFor };
