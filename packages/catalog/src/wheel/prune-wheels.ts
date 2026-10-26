/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { wheelRoot } from '@archipelia/engine';
import { readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { MAX_CACHE_BYTES, PART_MAX_AGE_MS, PART_SUFFIX } from './wheel.constants';
import { wheelEntries } from './wheel-entries';

const dropOldParts = async (root: string, now: number): Promise<void> => {
  const names = (await readdir(root).catch(() => [])).filter((name) => name.endsWith(PART_SUFFIX));
  for (const name of names) {
    const file = join(root, name);
    const found = await stat(file).catch(() => undefined);
    if (found && now - found.mtimeMs > PART_MAX_AGE_MS) await rm(file, { force: true });
  }
};

const pruneWheels = async (runtime: EngineRuntime, keep: string, max = MAX_CACHE_BYTES, now = Date.now()): Promise<void> => {
  const root = wheelRoot(runtime);
  await dropOldParts(root, now);
  const entries = await wheelEntries(root);
  let total = entries.reduce((sum, entry) => sum + entry.size, 0);
  for (const entry of entries.filter((other) => other.name !== keep).sort((left, right) => left.at - right.at)) {
    if (total <= max) return;
    await rm(entry.dir, { recursive: true, force: true });
    total -= entry.size;
  }
};

export { pruneWheels };
