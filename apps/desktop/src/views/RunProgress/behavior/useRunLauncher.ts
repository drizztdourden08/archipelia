/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { Session, SessionTemplate } from '@archipelia/model';
import { useRunsStore } from '../../../stores/useRunsStore';
import type { RunLaunch } from '../RunProgress.type';

const useRunLauncher = () => {
  const run = useRunsStore((state) => state.run);
  const [launch, setLaunch] = useState<RunLaunch | null>(null);

  const patchIf = useCallback((startedAt: number, patch: Partial<RunLaunch>) =>
    setLaunch((current) => (current?.startedAt === startedAt ? { ...current, ...patch } : current)), []);

  const start = useCallback(async (template: SessionTemplate) => {
    const startedAt = Date.now();
    setLaunch({ name: template.name, template, templateId: template.id, startedAt });
    try {
      const session = await run(template);
      patchIf(startedAt, { sessionId: session.id });
    } catch (err) {
      patchIf(startedAt, { error: (err as Error).message });
    }
  }, [patchIf, run]);

  const inspect = useCallback((session: Session) => {
    const working = session.status === 'generating' || session.status === 'starting';
    setLaunch({ name: session.snapshot.name, sessionId: session.id, startedAt: session.createdAt, inspect: !working });
  }, []);

  const dismiss = useCallback(() => setLaunch(null), []);

  return { dismiss, inspect, launch, start };
};

export { useRunLauncher };
