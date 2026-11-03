/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { Session } from '@archipelia/model';
import { parseSpoiler } from '@archipelia/sessions/spoiler';
import { useSessionText } from '../../../behavior/useSessionText';
import { useItemTypes } from './useItemTypes';

const useSpoilerLog = (session: Session, file: string | null) => {
  const text = useSessionText(session.id, file);
  const types = useItemTypes(session.id, file);
  const log = useMemo(() => {
    if (!text.value) return null;
    const named = session.players?.map((player) => player.name) ?? [];
    return parseSpoiler(text.value, { players: named.length > 0 ? named : types?.players, locations: types?.locations });
  }, [text.value, session.players, types]);
  return { text, log, types };
};

export { useSpoilerLog };
