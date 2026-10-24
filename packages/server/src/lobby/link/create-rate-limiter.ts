/* @layer core @kind logic */
import { LOBBY_INFO_LIMIT, LOBBY_INFO_WINDOW_MS, WRONG_CODE_LIMIT, WRONG_CODE_WINDOW_MS } from '@archipelia/lobby-protocol';
import { ADMIN_HELLO_LIMIT, ADMIN_HELLO_WINDOW_MS, MS_PER_SECOND } from './link.constants';

const createRateLimiter = (now: () => number = Date.now) => {
  const infos = new Map<string, number[]>();
  const misses = new Map<string, number[]>();
  const admins = new Map<string, number[]>();

  const recent = (book: Map<string, number[]>, address: string, windowMs: number) => {
    const kept = (book.get(address) ?? []).filter((at) => now() - at < windowMs);
    if (kept.length > 0) book.set(address, kept);
    else book.delete(address);
    return kept;
  };

  const retryAfter = (oldest: number, windowMs: number) => Math.max(1, Math.ceil((oldest + windowMs - now()) / MS_PER_SECOND));

  const record = (book: Map<string, number[]>, address: string, windowMs: number) => {
    book.set(address, [...recent(book, address, windowMs), now()]);
  };

  const over = (book: Map<string, number[]>, address: string, [limit, windowMs]: [number, number]): number | null => {
    const kept = recent(book, address, windowMs);
    return kept.length >= limit ? retryAfter(kept[0] ?? now(), windowMs) : null;
  };

  const blocked = (address: string) => over(misses, address, [WRONG_CODE_LIMIT, WRONG_CODE_WINDOW_MS]);

  const askInfo = (address: string): number | null => {
    const limited = over(infos, address, [LOBBY_INFO_LIMIT, LOBBY_INFO_WINDOW_MS]);
    if (limited !== null) return limited;
    record(infos, address, LOBBY_INFO_WINDOW_MS);
    return blocked(address);
  };

  const prune = () => {
    for (const [book, windowMs] of [[infos, LOBBY_INFO_WINDOW_MS], [misses, WRONG_CODE_WINDOW_MS], [admins, ADMIN_HELLO_WINDOW_MS]] as const) {
      for (const address of [...book.keys()]) recent(book, address, windowMs);
    }
  };

  return {
    askInfo,
    blocked,
    miss: (address: string) => record(misses, address, WRONG_CODE_WINDOW_MS),
    adminBlocked: (address: string) => over(admins, address, [ADMIN_HELLO_LIMIT, ADMIN_HELLO_WINDOW_MS]),
    adminMiss: (address: string) => record(admins, address, ADMIN_HELLO_WINDOW_MS),
    prune,
    size: () => infos.size + misses.size + admins.size,
  };
};

export { createRateLimiter };
