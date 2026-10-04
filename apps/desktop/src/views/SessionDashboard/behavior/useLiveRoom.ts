/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { Session } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';
import { checksFromLog, hintsFromLog, playerRows, presenceOf, roomPlayersOf, targetKey, watchTarget } from '@archipelia/sessions/live-room';
import { holdLiveRoom } from './hold-live-room';
import { useLiveRoomStore } from '../../../stores/useLiveRoomStore';

const useLiveRoom = (session: Session | null, lines: readonly HostLogLine[]) => {
  const { phase, error, players, statuses, watched, hints, passwordRequired, connect } = useLiveRoomStore();
  const target = useMemo(() => (session ? watchTarget(session) : null), [session]);
  const targetRef = useRef(target);
  targetRef.current = target;
  const key = targetKey(target);

  useEffect(() => (targetRef.current ? holdLiveRoom(targetRef.current) : undefined), [key]);

  const submitPassword = useCallback((password: string) => {
    if (targetRef.current) void connect(targetRef.current, password);
  }, [connect]);
  const retry = useCallback(() => submitPassword(''), [submitPassword]);

  const planned = session?.snapshot.players;
  const names = useMemo(() => (planned ?? []).map((player) => player.name), [planned]);
  const texts = useMemo(() => lines.map((line) => line.text), [lines]);
  const logChecks = useMemo(() => checksFromLog(texts, names), [texts, names]);
  const online = useMemo(() => presenceOf(texts, names), [texts, names]);
  const live = phase === 'live' && players.length > 0;
  const rows = useMemo(
    () => playerRows({ players: live ? players : roomPlayersOf(planned ?? []), statuses: live ? statuses : {}, watched: live ? watched : null, logChecks, online }),
    [live, players, planned, statuses, watched, logChecks, online],
  );

  const logHints = useMemo(() => (phase === 'live' ? [] : hintsFromLog(texts)), [phase, texts]);

  return { error, hints: phase === 'live' ? hints : logHints, passwordRequired, phase, players: rows, retry, submitPassword };
};

export { useLiveRoom };
