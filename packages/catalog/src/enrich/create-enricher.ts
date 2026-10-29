/* @layer core @kind logic */
import type { EnrichDeps, EnrichPlan, EnrichRecord, EnrichRequest, GameEnrichment } from './enrich.type';
import { FAIL_BACKOFF_MS, MAX_PARALLEL, SAFE_WORLD } from './enrich.constants';
import { createLimiter } from './create-limiter';
import { fromEngine } from './from-engine';
import { fromGithub } from './from-github';
import { isFresh } from './is-fresh';
import { planOf } from './plan-of';
import { readRecord } from './read-record';
import { resultOf } from './result-of';
import { writeRecord } from './write-record';

const createEnricher = (deps: EnrichDeps) => {
  const { cache, engineDir, now = Date.now } = deps;
  const net = deps.fetch ?? fetch;
  const limit = createLimiter(MAX_PARALLEL);
  const running = new Map<string, Promise<GameEnrichment | undefined>>();
  const failed = new Map<string, number>();

  const build = async (apworld: string, plan: EnrichPlan, old: EnrichRecord | undefined): Promise<EnrichRecord> =>
    (plan.repo ? fromGithub({ fetch: net, repo: plan.repo, release: plan.release, ...(plan.tag ? { tag: plan.tag } : {}), stamp: plan.stamp, old, now: now() }) : fromEngine(await engineDir(), apworld, plan, now()));

  const refresh = async (apworld: string, plan: EnrichPlan, old: EnrichRecord | undefined): Promise<GameEnrichment | undefined> => {
    try {
      const record = await build(apworld, plan, old);
      failed.delete(apworld);
      await writeRecord(cache, apworld, record);
      return resultOf(apworld, record);
    } catch {
      failed.set(apworld, now());
      return resultOf(apworld, old);
    }
  };

  const isBackedOff = (apworld: string) => now() - (failed.get(apworld) ?? -FAIL_BACKOFF_MS) < FAIL_BACKOFF_MS;

  const load = async (request: EnrichRequest): Promise<GameEnrichment | undefined> => {
    const plan = await planOf(deps, request);
    if (!plan) return undefined;
    const old = await readRecord(cache, request.apworld);
    if (old && isFresh(old, plan.stamp, now())) return resultOf(request.apworld, old);
    return isBackedOff(request.apworld) ? resultOf(request.apworld, old) : refresh(request.apworld, plan, old);
  };

  const enrich = (request: EnrichRequest): Promise<GameEnrichment | undefined> => {
    if (!SAFE_WORLD.test(request.apworld)) return Promise.resolve(undefined);
    const key = `${request.source}:${request.apworld}`;
    const pending = running.get(key) ?? limit(() => load(request)).finally(() => running.delete(key));
    running.set(key, pending);
    return pending;
  };

  return { enrich };
};

export { createEnricher };
