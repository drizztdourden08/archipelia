/* @layer core @kind logic */
import type { MappingState, RenewalOptions } from './mapping.type';
import { MIN_RENEW_MS, MS, RENEW_FRACTION, RENEW_RETRY_MS } from './mapping.constants';

const renewDelay = (lifetime: number): number => Math.max(lifetime * MS * RENEW_FRACTION, MIN_RENEW_MS);

const startRenewal = ({ method, session, onChange }: RenewalOptions) => {
  let state: MappingState = { mapped: true, method, external: session.external, message: 'mapped' };
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;

  const set = (next: MappingState) => {
    state = next;
    onChange?.(next);
  };

  const schedule = (delayMs: number) => {
    if (stopped) return;
    timer = setTimeout(() => void renew(), delayMs);
    timer.unref();
  };

  const renew = async () => {
    const outcome = await session.renew().catch((): { ok: false; detail: string } => ({ ok: false, detail: 'the renewal failed' }));
    if (stopped) return;
    if (!outcome.ok) {
      set({ mapped: false, method, external: null, message: `The port mapping could not be renewed: ${outcome.detail}.` });
      schedule(RENEW_RETRY_MS);
      return;
    }
    const changed = !state.mapped || state.external?.port !== outcome.external.port || state.external.address !== outcome.external.address;
    if (changed) set({ mapped: true, method, external: outcome.external, message: 'mapped' });
    if (outcome.lifetime > 0) schedule(renewDelay(outcome.lifetime));
  };

  if (session.lifetime > 0) schedule(renewDelay(session.lifetime));

  return {
    state: () => state,
    stop: async () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      await session.release().catch(() => undefined);
    },
  };
};

export { startRenewal };
