/* @layer renderer-app @kind hook */
import { Client, LoginError, itemsHandlingFlags } from 'archipelago.js';
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { LiveRoomTarget } from '@archipelia/sessions/live-room';
import { IDLE, LIVE_FAILED, LIVE_LOST, NO_RETRY, TRACKER_TAGS, WRONG_PASSWORD } from './live-room-store.constants';
import { logFailure } from '../hooks/log-failure';
import { createRetryTimer } from './retry-timer';
import { watchRoom } from './watch-room';
import type { LiveRoomState } from './live-room-store.type';

let client: Client | null = null;

let generation = 0;

let wanted: { target: LiveRoomTarget; password: string } | null = null;

let tried = 0;

const retryTimer = createRetryTimer();

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

const reasonOf = (error: unknown): string => (error instanceof LoginError ? error.errors.join(', ') : (error as Error).message);

const wrongPassword = (error: unknown): boolean => error instanceof LoginError && error.errors.includes('InvalidPassword');

const drop = () => {
  generation += 1;
  retryTimer.stop();
  client?.socket.disconnect();
  client = null;
};

const useLiveRoomStore = createSessionStore<LiveRoomState>((set, get) => {
  const current = (gen: number) => gen === generation;

  const tryNow = () => {
    if (!wanted) return;
    tried = get().attempt;
    void open(wanted.target, wanted.password, true);
  };

  const later = (gen: number, phase: 'failed' | 'closed', error: string, reason: string) => {
    const plan = retryTimer.plan(tried, () => { if (current(gen)) tryNow(); });
    if (plan) {
      set({ phase: 'reconnecting', error, retryAt: plan.retryAt, attempt: plan.attempt, attempts: plan.attempts, retrying: false });
      return;
    }
    logFailure(error, reason || 'The room did not answer');
    set({ phase, error, ...NO_RETRY });
  };

  const refused = (gen: number, error: unknown, password: string) => {
    if (!wrongPassword(error)) {
      later(gen, 'failed', LIVE_FAILED, reasonOf(error));
      return;
    }
    tried = 0;
    set({ phase: 'password', passwordRequired: true, error: password ? WRONG_PASSWORD : null, ...NO_RETRY });
  };

  const open = async (target: LiveRoomTarget, password: string, again: boolean) => {
    drop();
    wanted = { target, password };
    const gen = generation;
    const room = new Client();
    client = room;
    set(again ? { retrying: true, retryAt: null } : { ...IDLE, sessionId: target.sessionId, phase: 'connecting' });
    try {
      await loginFirst(room, target, password);
      if (!current(gen)) return;
      tried = 0;
      await watchRoom(room, set, () => current(gen), () => later(gen, 'closed', LIVE_LOST, 'The room closed the connection'));
    } catch (error) {
      room.socket.disconnect();
      if (current(gen)) refused(gen, error, password);
    }
  };

  const connect = (target: LiveRoomTarget, password = '') => {
    tried = 0;
    return open(target, password, false);
  };

  const retry = () => {
    if (!wanted || get().retrying) return;
    if (get().phase === 'reconnecting') tryNow();
    else void connect(wanted.target, wanted.password);
  };

  const disconnect = () => {
    drop();
    wanted = null;
    tried = 0;
    set(IDLE);
  };

  return { ...IDLE, connect, disconnect, retry };
});

export { useLiveRoomStore };
