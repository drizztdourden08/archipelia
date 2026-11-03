/* @layer core @kind logic */
import type { Session } from '@archipelia/model';
import type { ServiceDeps } from './service-deps.type';

const updateRun = ({ runs, emit }: ServiceDeps) => async (session: Session, patch: Partial<Session>) => {
  const next = { ...session, ...patch };
  await runs.put(next);
  emit({ type: 'session', session: next });
  return next;
};

export { updateRun };
