/* @layer core @kind logic */
import type { LiveSession } from './service-deps.type';

const liveEntry = (live: ReadonlyMap<string, LiveSession>, id: string): LiveSession => {
  const entry = live.get(id);
  if (!entry) throw new Error(`session ${id} is not running`);
  return entry;
};

export { liveEntry };
