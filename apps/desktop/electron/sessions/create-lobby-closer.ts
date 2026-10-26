/* @layer electron-main @kind logic */
import { LOCAL_SERVER } from '../../src/lobbies/lobbies.constants';
import type { PendingClose } from '../../src/lobbies/lobbies.type';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { CLOSE_RETRY_MAX_MS, CLOSE_RETRY_MS, PENDING_CLOSES_FILE } from './sessions.constants';
import type { CloserDeps } from './sessions.type';

const same = (left: PendingClose, right: PendingClose) => left.serverId === right.serverId && left.lobbyId === right.lobbyId;

const createLobbyCloser = (deps: CloserDeps) => {
  const timers = new Map<string, NodeJS.Timeout>();
  const attempts = new Map<string, number>();
  let queue: Promise<unknown> = Promise.resolve();
  const list = () => deps.files.readJson<PendingClose[]>(PENDING_CLOSES_FILE, []);
  const change = (edit: (pending: PendingClose[]) => PendingClose[]) => {
    const next = queue.then(async () => deps.files.writeJson(PENDING_CLOSES_FILE, edit(await list())));
    queue = next.catch(() => undefined);
    return next.then(async () => deps.emit(await list()));
  };

  const tryClose = async (ref: PendingClose) => {
    try {
      const ops = await deps.opsFor(ref.serverId);
      const lobby = (await ops.list()).find((entry) => entry.id === ref.lobbyId);
      if (lobby && lobby.phase !== 'closed') await ops.act(lobbyRequest.close(ref.lobbyId));
      return true;
    } catch {
      return false;
    }
  };

  const quietIfIdle = async (ref: PendingClose) => {
    if (ref.serverId !== LOCAL_SERVER) return;
    const still = (await deps.templates()).some(({ lan, lobby }) => lan === true && lobby?.serverId === LOCAL_SERVER && lobby.lobbyId !== undefined && lobby.lobbyId !== ref.lobbyId);
    if (!still) await deps.quiet();
  };

  const settle = async (ref: PendingClose): Promise<boolean> => {
    const key = `${ref.serverId}/${ref.lobbyId}`;
    clearTimeout(timers.get(key));
    if (await tryClose(ref)) {
      attempts.delete(key);
      await change((pending) => pending.filter((entry) => !same(entry, ref)));
      await quietIfIdle(ref);
      return true;
    }
    const tries = (attempts.get(key) ?? 0) + 1;
    attempts.set(key, tries);
    const delay = Math.min((deps.retryMs ?? CLOSE_RETRY_MS) * 2 ** (tries - 1), deps.retryMaxMs ?? CLOSE_RETRY_MAX_MS);
    timers.set(key, setTimeout(() => void settle(ref), delay).unref());
    return false;
  };

  return {
    list,
    close: async (ref: PendingClose) => {
      await change((pending) => [...pending.filter((entry) => !same(entry, ref)), ref]);
      return { closed: await settle(ref) };
    },
    retryAll: async () => { await Promise.all((await list()).map(settle)); },
    stop: () => timers.forEach((timer) => clearTimeout(timer)),
  };
};

export { createLobbyCloser };
