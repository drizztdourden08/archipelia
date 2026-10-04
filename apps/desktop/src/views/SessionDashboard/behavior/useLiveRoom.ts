/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { Session } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';
import { holdLiveRoom } from '../../../live-room/hold-live-room';
import { useLiveRoomStore } from '../../../stores/useLiveRoomStore';
import { checksFromLog } from '../../../live-room/log-checks';
import { playerRows } from '../../../live-room/player-rows';
import { presenceOf } from '../../../live-room/presence-of';
import { roomPlayersOf } from '../../../live-room/room-players-of';
import { targetKey } from '../../../live-room/target-key';
import { watchTarget } from '../../../live-room/watch-target';

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

  return { error, hints, passwordRequired, phase, players: rows, submitPassword };
};

export { useLiveRoom };
