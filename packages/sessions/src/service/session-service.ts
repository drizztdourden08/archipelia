/* @layer core @kind logic */
import type { RunEndReason, SessionTemplate } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';
import { newId } from '@drizztdourden08/brock-core/storage';
import type { LiveSession, ServiceDeps } from './service-deps.type';
import type { LobbyRun } from './lobby-run.type';
import { lobbyEngines } from './lobby-engines';
import { startedRun } from './started-run';
import { produceSession } from './produce-session';
import { hostSession } from './host-session';
import { sessionItemTypes } from './session-item-types';
import { sessionEngineOf } from '../engine/session-engine-of';
import { liveEntry } from './live-entry';
import { saveStopped } from './save-stopped';
import { updateRun } from './update-run';
import { recoverRuns } from './recover-runs';
import { CANCELLED, SERVER_LINES } from './session-service.constants';

const createSessionService = (deps: ServiceDeps) => {
  const { files, runs } = deps;
  const live = new Map<string, LiveSession>();
  const pending = new Map<string, AbortController>();
  const stopping = new Set<string>();

  const update = updateRun(deps);
  const liveOf = (id: string) => liveEntry(live, id);

  const stop = async (id: string, reason: RunEndReason = 'stopped') => {
    const entry = liveOf(id);
    stopping.add(id);
    await entry.host.stop().finally(() => stopping.delete(id));
    live.delete(id);
    return saveStopped(deps, id, entry, reason);
  };

  const serverExited = async (id: string) => {
    if (live.has(id) && !stopping.has(id)) await stop(id, 'server exited').catch(() => undefined);
  };

  const recover = () => recoverRuns({ files, runs, live, update });

  const run = async (template: SessionTemplate, outer?: AbortSignal, lobby?: LobbyRun) => {
    let session = await update(startedRun(template, lobby, newId(), Date.now()), {});
    const controller = new AbortController();
    pending.set(session.id, controller);
    const signal = outer ? AbortSignal.any([outer, controller.signal]) : controller.signal;
    try {
      const engines = lobbyEngines(lobby);
      const runtime = engines.runtime ?? await deps.runtime();
      session = await update(session, { engine: sessionEngineOf(runtime) });
      const { output, seed } = await produceSession(deps, session, { runtime, signal, confine: engines.confine, timeoutMs: engines.timeoutMs, disk: engines.disk });
      session = await update(session, { status: 'starting', output, seed });
      const endpoint = await hostSession({ deps, live, signal, runtime: engines.host }, session);
      const hosting = await update(session, { status: 'hosting', endpoint });
      live.get(session.id)?.host.onExit?.(() => void serverExited(session.id));
      return hosting;
    } catch (err) {
      await live.get(session.id)?.host.stop().catch(() => undefined);
      live.delete(session.id);
      return await update(session, { status: 'failed', error: signal.aborted ? CANCELLED : (err as Error).message });
    } finally {
      pending.delete(session.id);
    }
  };

  const command = (id: string, cmd: string) => liveOf(id).host.command(cmd);

  const logOf = async (id: string): Promise<HostLogLine[]> =>
    live.get(id)?.log ?? files.readJson<HostLogLine[]>(`${id}/${SERVER_LINES}`, []).catch(() => []);

  const cancel = async (id: string) => {
    const running = pending.get(id);
    if (running) return running.abort();
    if (live.has(id)) await stop(id);
  };

  const stopLocal = async () => {
    pending.forEach((controller) => controller.abort());
    await Promise.all([...live].filter(([, entry]) => entry.host.kind === 'local').map(([id]) => stop(id)));
  };

  const running = (id: string) => live.has(id);

  const itemTypes = sessionItemTypes(deps);

  return { cancel, command, itemTypes, logOf, recover, run, running, stop, stopLocal };
};

export { createSessionService };
