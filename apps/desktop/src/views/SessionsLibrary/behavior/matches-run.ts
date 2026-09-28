/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const matchesRun = (session: Session, query: string) => {
  const needle = query.trim().toLowerCase();
  return !needle || `${session.snapshot.name} ${session.status} ${session.seed ?? ''}`.toLowerCase().includes(needle);
};

export { matchesRun };
