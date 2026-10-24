/* @layer electron-main @kind logic */
import type { CarryResult, RecordGuard } from '@archipelia/catalog';
import type { EngineChoice, EngineInstallResult } from '@archipelia/model';
import { CHECK_NAME } from './engine-text.constants';
import type { BuiltEngine, InstallDeps, InstallProgress, InstallRun } from './install-engine.type';
import type { SmokeOutcome } from './smoke/smoke.type';
import { switchEngine } from './switch-engine';

const messageOf = (err: unknown) => (err instanceof Error ? err.message : String(err));

const unique = (values: string[]) => [...new Set(values)];

const failedWith = async ({ deps, choice }: InstallRun, result: Omit<EngineInstallResult, 'outcome'>): Promise<EngineInstallResult> => {
  const fallback = await deps.fallback(choice).catch(() => undefined);
  return { outcome: 'failed', ...result, ...(fallback ? { fallback } : {}) };
};

const carriedGames = (carry: CarryResult | undefined, guard: RecordGuard | undefined): string[] => {
  if (!carry || !guard) return [];
  const names = new Set([...carry.copied, ...carry.reinstalled]);
  return guard.records.filter((record) => names.has(record.apworld)).map((record) => record.game);
};

const buildChoice = async ({ deps, choice, job, progress }: InstallRun): Promise<BuiltEngine> => {
  const { signal } = job;
  job.step('resolve', `Checking Archipelago ${choice.ap} with Python ${choice.python}`);
  const { spec, warnings } = await deps.resolve(choice, signal);
  warnings.forEach((line) => job.log(line, 'warn'));
  progress.existed = await deps.wasBuilt(spec.id);
  progress.id = spec.id;
  signal.throwIfAborted();
  await deps.build(spec, {
    onLine: (line) => job.log(line), onStep: (step, line) => job.step(step, line), onSkip: (step) => job.skip(step), signal,
  });
  const target = await deps.runtimeOf(spec.id);
  const active = await deps.active();
  const isActive = active?.id === spec.id;
  return { spec, target, isActive, ...(active && !isActive ? { from: active } : {}) };
};

const carryFirst = async ({ deps, job, progress }: InstallRun, { from, target }: BuiltEngine) => {
  if (!from) {
    job.skip('worlds');
    return undefined;
  }
  job.step('worlds', 'Carrying your worlds to the new engine');
  progress.guard = await deps.guardRecords();
  const pass = await deps.carry({ from, to: target, since: 0 });
  await progress.guard.note(pass);
  pass.problems.forEach((problem) => job.log(`${problem.game} did not carry over: ${problem.reason}`, 'warn'));
  return pass;
};

const failSmoke = async (run: InstallRun, built: BuiltEngine, smoke: SmokeOutcome) => {
  const { deps, job, progress } = run;
  const check = smoke.result.failed ?? 'schema';
  const error = `${CHECK_NAME[check]} failed: ${smoke.error ?? 'no detail given'}`;
  if (!built.isActive) await deps.register({ ...(await deps.describe(built.spec.id)), state: 'failed', smoke: smoke.result });
  progress.kept = true;
  await progress.guard?.restore();
  job.fail(new Error(error));
  return failedWith(run, { id: built.spec.id, failed: check, error });
};

const holdBack = async ({ job, progress }: InstallRun, built: BuiltEngine, broken: string[]): Promise<EngineInstallResult> => {
  await progress.guard?.restore();
  job.skip('switch');
  job.done(`Archipelago ${built.spec.ap.version} is installed, not switched: ${broken.length} of your worlds do not load on it`);
  return { outcome: 'ready', id: built.spec.id, brokenWorlds: broken };
};

const runInstall = async (run: InstallRun): Promise<EngineInstallResult> => {
  const { deps, job, progress } = run;
  const built = await buildChoice(run);
  const { spec, target, from } = built;
  const first = await carryFirst(run, built);
  job.signal.throwIfAborted();
  job.step('smoke', 'Testing the engine');
  const smoke = await deps.smoke({ runtime: target, carried: carriedGames(first, progress.guard), signal: job.signal, log: (line) => job.log(line) });
  job.signal.throwIfAborted();
  smoke.result.warnings.forEach((line) => job.log(line, 'warn'));
  await deps.stamp(spec.id, smoke.result);
  if (!smoke.result.ok) return failSmoke(run, built, smoke);
  await deps.register({ ...(await deps.describe(spec.id)), state: 'ready', smoke: smoke.result });
  progress.kept = true;
  const broken = unique([...(first?.problems.map((problem) => problem.game) ?? []), ...smoke.broken]);
  if (broken.length > 0) return holdBack(run, built, broken);
  job.step('switch', `Switching to Archipelago ${spec.ap.version}`);
  await switchEngine(deps, { id: spec.id, since: first?.at ?? 0, ...(from ? { from } : {}), ...(progress.guard ? { guard: progress.guard } : {}) });
  progress.guard = undefined;
  job.done(`Archipelago ${spec.ap.version} is now the engine`);
  return { outcome: 'switched', id: spec.id };
};

const installEngine = async (deps: InstallDeps, choice: EngineChoice): Promise<EngineInstallResult> => {
  const progress: InstallProgress = { existed: false, kept: false };
  const run: InstallRun = { deps, choice, job: deps.job(), progress };
  try {
    return await runInstall(run);
  } catch (err) {
    await progress.guard?.restore().catch(() => undefined);
    if (progress.id && !progress.kept && !progress.existed) await deps.discard(progress.id).catch(() => undefined);
    const id = progress.id ? { id: progress.id } : {};
    if (run.job.signal.aborted) return { outcome: 'cancelled', ...id };
    run.job.fail(err);
    return failedWith(run, { ...id, error: messageOf(err) });
  }
};

export { installEngine };
