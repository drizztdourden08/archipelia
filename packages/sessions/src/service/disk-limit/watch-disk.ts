/* @layer core @kind logic */
import { DISK_CHECK_MS } from './disk-limit.constants';
import type { DiskLimit, DiskWatch } from './disk-limit.type';
import { diskMessage } from './disk-message';
import { folderBytes } from './folder-bytes';

const idle = (signal: AbortSignal | undefined): DiskWatch => ({ signal, failure: () => undefined, check: () => Promise.resolve(), stop: () => undefined });

const watchDisk = (limit: DiskLimit | undefined, dirs: string[], outer: AbortSignal | undefined): DiskWatch => {
  if (!limit) return idle(outer);
  const stopper = new AbortController();
  let failed: Error | undefined;
  let measuring: Promise<void> | undefined;

  const measure = async () => {
    let total = 0;
    for (const dir of [...dirs, ...limit.extraDirs]) {
      total += await folderBytes(dir, limit.bytes - total);
      if (total > limit.bytes) {
        failed = new Error(diskMessage(limit.bytes));
        stopper.abort();
        return;
      }
    }
  };

  const check = async () => {
    measuring ??= measure().finally(() => { measuring = undefined; });
    await measuring;
    if (failed) throw failed;
  };

  const timer = setInterval(() => void check().catch(() => undefined), limit.intervalMs ?? DISK_CHECK_MS);
  timer.unref();
  return {
    signal: outer ? AbortSignal.any([outer, stopper.signal]) : stopper.signal,
    failure: () => failed,
    check,
    stop: () => clearInterval(timer),
  };
};

export { watchDisk };
