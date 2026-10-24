/* @layer core @kind logic */
import { join } from 'node:path';
import { SMOKE_DIR } from './smoke.constants';
import type { SmokeCheck, SmokeDeps, SmokeInput, SmokeOutcome } from './smoke.type';

class CheckFailed extends Error {
  constructor(readonly check: SmokeCheck, cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause));
  }
}

const attempt = async <T>(check: SmokeCheck, signal: AbortSignal, work: () => Promise<T>): Promise<T> => {
  try {
    return await work();
  } catch (err) {
    signal.throwIfAborted();
    throw new CheckFailed(check, err);
  }
};

const runChecks = async (deps: SmokeDeps, { runtime, carried, signal, log }: SmokeInput, warnings: string[]) => {
  const dir = join(runtime.root, SMOKE_DIR);
  const world = await attempt('schema', signal, () => deps.placeWorld(runtime, carried));
  try {
    const games = [...new Set([world.game, ...carried])];
    log(`Reading the options of ${games.join(', ')}`);
    const schemas = await attempt('schema', signal, () => deps.readSchemas(runtime, games));
    if (!schemas.loaded.includes(world.game)) {
      throw new CheckFailed('schema', schemas.errors[world.game] ?? `${world.game} did not load`);
    }
    const broken = carried.filter((game) => !schemas.loaded.includes(game));
    log(`Generating a test seed with one ${world.game} player`);
    const seed = await attempt('generate', signal, () => deps.generateSeed({ runtime, dir, game: world.game, signal, log }));
    warnings.push(...seed.warnings);
    log('Hosting the test seed');
    await attempt('host', signal, () => deps.hostSeed({ runtime, dir, seedFile: seed.seedFile, signal, log }));
    await deps.clearWork(dir);
    return broken;
  } finally {
    await world.remove().catch(() => undefined);
  }
};

const runSmoke = async (deps: SmokeDeps, input: SmokeInput): Promise<SmokeOutcome> => {
  const at = deps.now();
  const warnings: string[] = [];
  try {
    const broken = await runChecks(deps, input, warnings);
    return { result: { ok: true, at, warnings }, broken };
  } catch (err) {
    if (!(err instanceof CheckFailed)) throw err;
    return { result: { ok: false, at, failed: err.check, warnings }, broken: [], error: err.message };
  }
};

export { runSmoke };
