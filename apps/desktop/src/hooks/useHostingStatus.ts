/* @layer renderer-app @kind hook */
import type { TitleBarItemSpec } from '@drizztdourden08/brock-react';
import type { Session } from '@archipelia/model';
import { useRunsStore } from '../stores/useRunsStore';
import { useAppNavigation } from './useAppNavigation';

const newestHosting = (runs: readonly Session[]): Session | undefined =>
  runs.reduce<Session | undefined>((found, run) => (run.status === 'hosting' && (!found || run.createdAt > found.createdAt) ? run : found), undefined);

const useHostingStatus = (): TitleBarItemSpec | null => {
  const room = useRunsStore((state) => newestHosting(state.runs));
  const { openSession } = useAppNavigation();
  if (!room) return null;
  return { kind: 'status', label: 'Show the hosting room', icon: 'radio', status: `Hosting: ${room.snapshot.name}`, tone: 'success', onSelect: () => openSession(room.id) };
};

export { useHostingStatus };
