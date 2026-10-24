/* @layer core @kind logic */
import { HELLO_TIMEOUT_MS } from '@archipelia/lobby-protocol';
import type { Transport } from '@archipelia/lobby-protocol/node';
import { isRecord } from '@archipelia/model';
import { LOOPBACK_ADDRESSES } from '../listener.constants';
import type { AdminDeps, Peer } from '../listener.type';
import { ADMIN_MAX_BYTES, ADMIN_PROTOCOL, ADMIN_VERSION, CLOSE_BAD, CLOSE_REFUSED } from './admin.constants';
import type { AdminReply } from './admin.type';
import { adminHandlers } from './admin-handlers';
import { adminView } from './admin-view';
import { sameToken } from './same-token';

const parse = (text: string): Record<string, unknown> | null => {
  try {
    const value: unknown = text.length <= ADMIN_MAX_BYTES ? JSON.parse(text) : null;
    return isRecord(value) && typeof value.type === 'string' ? value : null;
  } catch {
    return null;
  }
};

const createAdminConnection = (deps: AdminDeps, transport: Transport, peer: Peer) => {
  const send = (message: Record<string, unknown>) => transport.send(JSON.stringify(message));
  const refuse = (message: string, code: number) => {
    send({ type: 'error', code: 'admin-refused', message, fatal: true });
    transport.close(code);
  };
  if (!peer.secure && !LOOPBACK_ADDRESSES.includes(peer.address)) {
    refuse('Plain ws admin is open to this computer only. Connect with wss.', CLOSE_REFUSED);
    return;
  }
  let unwatch: (() => void) | null = null;
  const timer = setTimeout(() => refuse('No admin.hello arrived in time.', CLOSE_BAD), HELLO_TIMEOUT_MS).unref();
  const reply = (request: Record<string, unknown>, body: Omit<AdminReply, 'type' | 're'>) =>
    send({ type: 'admin.reply', ...(typeof request.seq === 'number' ? { re: request.seq } : {}), ...body });

  const hello = async (request: Record<string, unknown>) => {
    if (request.type !== 'admin.hello' || !sameToken(request.token, await deps.token())) return refuse('The admin token is wrong.', CLOSE_REFUSED);
    clearTimeout(timer);
    unwatch = deps.watch((lobby) => send({ type: 'lobby.detail', lobby: adminView(lobby) }));
    return send({ type: 'admin.welcome', ...(typeof request.seq === 'number' ? { re: request.seq } : {}), protocol: { name: ADMIN_PROTOCOL, version: ADMIN_VERSION }, server: deps.info() });
  };

  const call = async (request: Record<string, unknown>) => {
    const handler = adminHandlers[String(request.type)];
    if (!handler) return reply(request, { ok: false, error: `The request ${String(request.type)} is not known.` });
    try {
      return reply(request, { ok: true, result: await handler(deps, request) });
    } catch (error) {
      return reply(request, { ok: false, error: error instanceof Error ? error.message : String(error) });
    }
  };

  let tail: Promise<unknown> = Promise.resolve();
  transport.listen((event) => {
    if (event.kind === 'close') {
      clearTimeout(timer);
      unwatch?.();
      return;
    }
    const request = event.kind === 'text' ? parse(event.text) : null;
    if (!request) return refuse('Admin messages are JSON objects with a type.', CLOSE_BAD);
    tail = tail.then(() => (unwatch ? call(request) : hello(request)));
    return undefined;
  });
};

export { createAdminConnection };
