/* @layer tests @kind test */
import type { FeedCache, FeedStore } from '../../src';

type MemoryStore = FeedStore & { current: () => FeedCache | undefined; writes: () => number };

const memoryStore = (initial?: FeedCache): MemoryStore => {
  let held = initial;
  let writes = 0;
  return {
    read: () => Promise.resolve(held),
    write: (cache) => {
      held = cache;
      writes += 1;
      return Promise.resolve();
    },
    current: () => held,
    writes: () => writes,
  };
};

export { memoryStore };
