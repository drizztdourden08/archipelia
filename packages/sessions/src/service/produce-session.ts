/* @layer core @kind logic */
import { rm } from 'node:fs/promises';
import { generate } from '@archipelia/engine';
import type { Session } from '@archipelia/model';
import { removeSessionSettings, writeSessionSettings } from '@archipelia/hosts';
import { readOutput } from '../output/read-output';
import { writePlayers } from '../players/write-players';
import { bakesPassword } from './bakes-password';
import { failureOf } from './failure-of';
import { CONFINED_DIR, MINUTE_MS } from './produce-session.constants';
import type { GenerateRun, ProduceRun } from './produce-session.type';
import { watchDisk } from './disk-limit/watch-disk';
import { releaseZip } from './release-zip';
import { roomPasswordOf } from './room-password';
import type { ServiceDeps } from './service-deps.type';
import { timeLimit } from './time-limit';

const runGenerator = (deps: ServiceDeps, session: Session, { runtime, settingsDir, signal, wrap, base }: GenerateRun) => {
  const { files, emit } = deps;
  const { generator } = session.snapshot;
  return generate({
    runtime, playersDir: files.path(`${base}/players`), outDir: files.path(`${base}/output`), settingsDir,
    spoiler: generator.spoiler, race: generator.race, skipBalancing: !generator.progressionBalancing, signal, wrap,
    onProgress: (progress) => emit({ type: 'progress', sessionId: session.id, progress }),
    onLine: (line) => emit({ type: 'generate', sessionId: session.id, line }),
  });
};

const generateIn = async (deps: ServiceDeps, session: Session, run: ProduceRun, base: string) => {
  const workDir = deps.files.path(base);
  await writePlayers(session.snapshot.players, `${base}/players`, deps);
  const baked = bakesPassword(session.snapshot.host) ? await roomPasswordOf(deps, session) : undefined;
  if (baked) await writeSessionSettings(workDir, baked);
  const limit = timeLimit(run.signal, run.timeoutMs);
  const disk = watchDisk(run.disk, [workDir], limit.signal);
  const generating = runGenerator(deps, session, { runtime: run.runtime, signal: disk.signal, wrap: run.confine?.(workDir), settingsDir: baked ? workDir : undefined, base });
  return generating.then(async (result) => {
    await disk.check();
    return result;
  }).catch((error: unknown) => {
    const full = disk.failure();
    if (full) throw full;
    if (limit.expired()) throw new Error(`Generate ran past ${Math.round((run.timeoutMs ?? 0) / MINUTE_MS)} minutes and was stopped.`);
    throw error;
  }).finally(() => {
    disk.stop();
    return removeSessionSettings(workDir);
  });
};

const produceSession = async (deps: ServiceDeps, session: Session, run: ProduceRun) => {
  const { files } = deps;
  const dir = session.id;
  const base = run.confine ? `${dir}/${CONFINED_DIR}` : dir;
  try {
    const result = await generateIn(deps, session, run, base);
    await files.writeText(`${dir}/generate.log`, result.lines.join('\n'));
    if (!result.ok || !result.zip) throw new Error(failureOf(result.lines));
    const zip = run.confine ? await releaseZip(files.path(`${base}/output`), result.zip, files.path(`${dir}/output`)) : result.zip;
    return await readOutput(files, `${dir}/output`, zip, 'generate.log');
  } finally {
    if (run.confine) await rm(files.path(base), { recursive: true, force: true });
  }
};

export { produceSession };
