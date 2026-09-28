/* @layer core @kind logic */
import { join } from 'node:path';
import { generate } from '@archipelia/engine';
import type { Session } from '@archipelia/model';
import { removeSessionSettings, writeSessionSettings } from '@archipelia/hosts';
import { readOutput } from '../output/read-output';
import { writePlayers } from '../players/write-players';
import { sessionDirOf } from '../store/session-dir-of';
import { bakesPassword } from './bakes-password';
import { failureOf } from './failure-of';
import { roomPasswordOf } from './room-password';
import type { ServiceDeps } from './service-deps.type';

const runGenerator = async (deps: ServiceDeps, session: Session, settingsDir: string | undefined, signal?: AbortSignal) => {
  const { dataRoot, emit } = deps;
  const dir = sessionDirOf(session.id);
  const { generator } = session.snapshot;
  return generate({
    runtime: await deps.runtime(), playersDir: join(dataRoot, `${dir}/players`), outDir: join(dataRoot, `${dir}/output`), settingsDir,
    spoiler: generator.spoiler, race: generator.race, skipBalancing: !generator.progressionBalancing, signal,
    onProgress: (progress) => emit({ type: 'progress', sessionId: session.id, progress }),
    onLine: (line) => emit({ type: 'generate', sessionId: session.id, line }),
  });
};

const produceSession = async (deps: ServiceDeps, session: Session, signal?: AbortSignal) => {
  const { files, dataRoot } = deps;
  const dir = sessionDirOf(session.id);
  const sessionDir = join(dataRoot, dir);
  await writePlayers(session.snapshot.players, `${dir}/players`, deps);
  const baked = bakesPassword(session.snapshot.host) ? await roomPasswordOf(deps, session) : undefined;
  if (baked) await writeSessionSettings(sessionDir, baked);
  const result = await runGenerator(deps, session, baked ? sessionDir : undefined, signal).finally(() => removeSessionSettings(sessionDir));
  await files.writeText(`${dir}/generate.log`, result.lines.join('\n'));
  if (!result.ok || !result.zip) throw new Error(failureOf(result.lines));
  return readOutput(files, `${dir}/output`, result.zip, 'generate.log');
};

export { produceSession };
