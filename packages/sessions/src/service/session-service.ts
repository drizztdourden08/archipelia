/* @layer core @kind logic */
import type { Session, SessionTemplate } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';
import type { LiveSession, ServiceDeps } from './service-deps.type';
import { produceSession } from './produce-session';
import { hostSession } from './host-session';
import { CANCELLED } from './session-service.constants';

const createSessionService = (deps: ServiceDeps) => {
  const { files, runs, emit } = deps;
  const live = new Map<string, LiveSession>();
  const pending = new Map<string, AbortController>();

  const update = async (session: Session, patch: Partial<Session>) => {
    const next = { ...session, ...patch };
    await runs.put(next);
    emit({ type: 'session', session: next });
    return next;
  };

  const run = async (template: SessionTemplate, outer?: AbortSignal) => {
    let session = await update({ id: newId(), templateId: template.id, snapshot: template, status: 'generating', createdAt: Date.now() }, {});
    const controller = new AbortController();
    pending.set(session.id, controller);
    const signal = outer ? AbortSignal.any([outer, controller.signal]) : controller.signal;
    try {
      const { output, seed } = await produceSession(deps, session, signal);
      session = await update(session, { status: 'starting', output, seed });
      return await update(session, { status: 'hosting', endpoint: await hostSession({ deps, live, signal }, session) });
    } catch (err) {
      await live.get(session.id)?.host.stop().catch(() => undefined);
      live.delete(session.id);
      return await update(session, { status: 'failed', error: signal.aborted ? CANCELLED : (err as Error).message });
    } finally {
      pending.delete(session.id);
    }
  };

  const liveOf = (id: string) => {
    const entry = live.get(id);
    if (!entry) throw new Error(`session ${id} is not running`);
    return entry;
  };

  const stop = async (id: string) => {
    const entry = liveOf(id);
    await entry.host.stop();
    live.delete(id);
    await files.writeText(`${id}/server.log`, entry.log.map((line) => line.text).join('\n'));
    const session = await runs.get(id);
    return session ? update(session, { status: 'stopped', serverLog: 'server.log' }) : undefined;
  };

  const command = (id: string, cmd: string) => liveOf(id).host.command(cmd);

  const logOf = (id: string) => live.get(id)?.log ?? [];

  const cancel = async (id: string) => {
    const running = pending.get(id);
    if (running) return running.abort();
    if (live.has(id)) await stop(id);
  };

  const stopLocal = async () => {
    pending.forEach((controller) => controller.abort());
    await Promise.all([...live].filter(([, entry]) => entry.host.kind === 'local').map(([id]) => stop(id)));
  };

  return { cancel, command, logOf, run, stop, stopLocal };
};

export { createSessionService };
