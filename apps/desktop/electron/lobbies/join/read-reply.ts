/* @layer electron-main @kind logic */
import { isRecord } from '@archipelia/model';
import type { LobbyProbe } from '../../../src/lobbies/lobbies.type';

const parse = (text: string): unknown => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const textOf = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);

const gamesOf = (value: unknown): string[] =>
  Array.isArray(value) ? value.flatMap((world: unknown) => (isRecord(world) && typeof world.game === 'string' ? [world.game] : [])) : [];

const probeOf = (lobby: Record<string, unknown>): LobbyProbe => {
  const engine = isRecord(lobby.engine) ? lobby.engine : {};
  const name = textOf(lobby.name);
  const ap = textOf(engine.ap);
  const phase = textOf(lobby.phase);
  const admission = textOf(lobby.admission);
  return {
    ok: true, message: '', joinable: lobby.joinable === true, games: gamesOf(lobby.worlds),
    ...(name ? { name } : {}), ...(ap ? { ap } : {}), ...(phase ? { phase } : {}), ...(admission ? { admission } : {}),
  };
};

const readReply = (text: string): LobbyProbe | null => {
  const message = parse(text);
  if (!isRecord(message)) return null;
  if (message.type === 'lobby.info.reply' && isRecord(message.lobby)) return probeOf(message.lobby);
  if (message.type === 'error') return { ok: false, message: textOf(message.message) ?? 'The server refused the question.' };
  return null;
};

export { readReply };
