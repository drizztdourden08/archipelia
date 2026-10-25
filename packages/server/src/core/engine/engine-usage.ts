/* @layer core @kind logic */
import type { SessionHost } from '@archipelia/hosts';
import type { SessionEvent } from '@archipelia/sessions';
import { ENGINE_TEXT } from '@archipelia/engine/install';
import type { HostFor } from './engine-usage.type';

const createEngineUsage = () => {
  const hosting = new Map<SessionHost, string>();
  const generating = new Map<string, string>();

  const track = (event: SessionEvent) => {
    if (event.type !== 'session') return;
    const { session } = event;
    if (session.status === 'generating' && session.engine?.id) generating.set(session.id, session.engine.id);
    else generating.delete(session.id);
  };

  const watch = (hostFor: HostFor): HostFor => async (target, runtime, binding) => {
    const host = binding ? await hostFor(target, runtime, binding) : await hostFor(target, runtime);
    if (host.kind !== 'local' || !runtime) return host;
    hosting.set(host, runtime.id);
    const stop = async () => {
      try {
        await host.stop();
      } finally {
        hosting.delete(host);
      }
    };
    return { kind: host.kind, start: host.start, command: host.command, onLog: host.onLog, stop };
  };

  const inUse = (id: string): string | undefined => {
    if ([...hosting.values()].includes(id)) return ENGINE_TEXT.hosting;
    if ([...generating.values()].includes(id)) return ENGINE_TEXT.generating;
    return undefined;
  };

  return { inUse, track, watch };
};

export { createEngineUsage };
