/* @layer core @kind logic */
import { LOBBY_INFO_LIMIT, LOBBY_INFO_WINDOW_MS, WRONG_CODE_LIMIT, WRONG_CODE_WINDOW_MS } from '@archipelia/lobby-protocol';
import { MS_PER_SECOND } from './link.constants';

const createRateLimiter = (now: () => number = Date.now) => {
  const infos = new Map<string, number[]>();
  const misses = new Map<string, number[]>();

  const recent = (book: Map<string, number[]>, address: string, windowMs: number) => {
    const kept = (book.get(address) ?? []).filter((at) => now() - at < windowMs);
    book.set(address, kept);
    return kept;
  };

  const retryAfter = (oldest: number, windowMs: number) => Math.max(1, Math.ceil((oldest + windowMs - now()) / MS_PER_SECOND));

  const blocked = (address: string): number | null => {
    const kept = recent(misses, address, WRONG_CODE_WINDOW_MS);
    return kept.length >= WRONG_CODE_LIMIT ? retryAfter(kept[0] ?? now(), WRONG_CODE_WINDOW_MS) : null;
  };

  const miss = (address: string) => {
    recent(misses, address, WRONG_CODE_WINDOW_MS).push(now());
  };

  const askInfo = (address: string): number | null => {
    const kept = recent(infos, address, LOBBY_INFO_WINDOW_MS);
    if (kept.length >= LOBBY_INFO_LIMIT) return retryAfter(kept[0] ?? now(), LOBBY_INFO_WINDOW_MS);
    kept.push(now());
    return blocked(address);
  };

  return { askInfo, blocked, miss };
};

export { createRateLimiter };
