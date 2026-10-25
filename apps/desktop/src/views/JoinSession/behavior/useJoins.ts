/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import { failWith } from '../../../hooks/fail-with';
import { appApi } from '../../../ipc/app-api';
import type { JoinView } from '../../../joins/joins.type';
import { FAILURE } from '../JoinSession.constants';
import { mergeJoin } from './merge-join';

const useJoins = () => {
  const [joins, setJoins] = useState<JoinView[]>([]);
  const { guard, isBusy, lastError } = useKeyedGuard();

  const reload = useCallback(() => guard('load', failWith(FAILURE.load, async () => { setJoins(await appApi().joinsList()); })), [guard]);

  useEffect(() => {
    const stop = appApi().onJoinEvent((view) => setJoins((now) => mergeJoin(now, view)));
    void reload();
    return stop;
  }, [reload]);

  const drop = (id: string) => setJoins((now) => now.filter((join) => join.id !== id));

  return {
    joins,
    busy: isBusy(),
    error: lastError,
    reload,
    leave: (id: string) => void guard(`leave:${id}`, failWith(FAILURE.leave, async () => { await appApi().joinsLeave(id); drop(id); })),
    dismiss: (id: string) => void guard(`dismiss:${id}`, failWith(FAILURE.leave, async () => { await appApi().joinsDismiss(id); drop(id); })),
    resume: (id: string) => void guard(`resume:${id}`, failWith(FAILURE.resume, () => appApi().joinsResume(id))),
  };
};

export { useJoins };
