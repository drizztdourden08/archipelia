/* @layer tests @kind test */
import type { FetchLike, FetchedResponse } from '../../src';

type Reply = { status?: number; headers?: Record<string, string>; json?: unknown; text?: string; fail?: string };

type FakeFetch = { fetch: FetchLike; calls: { url: string; headers: Record<string, string> }[] };

const toResponse = (reply: Reply): FetchedResponse => {
  const status = reply.status ?? 200;
  const headers = new Map(Object.entries(reply.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]));
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers.get(name.toLowerCase()) ?? null },
    json: () => Promise.resolve(reply.json),
    text: () => Promise.resolve(reply.text ?? ''),
  };
};

const fakeFetch = (routes: Record<string, Reply | Reply[]>): FakeFetch => {
  const queues = new Map(Object.entries(routes).map(([url, reply]) => [url, Array.isArray(reply) ? [...reply] : [reply]]));
  const calls: FakeFetch['calls'] = [];
  const fetch: FetchLike = (url, init) => {
    calls.push({ url, headers: init?.headers ?? {} });
    const queue = queues.get(url);
    const reply = queue && queue.length > 1 ? queue.shift() : queue?.[0];
    if (!reply) return Promise.resolve(toResponse({ status: 404 }));
    if (reply.fail) return Promise.reject(new Error(reply.fail));
    return Promise.resolve(toResponse(reply));
  };
  return { fetch, calls };
};

export { fakeFetch };
