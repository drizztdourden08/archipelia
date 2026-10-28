/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { applyOverrides } from '../live/apply-overrides';
import type { LiveTab } from '../live/live.type';
import { useTabDraftStore } from '../stores/useTabDraftStore';

const useTabDraft = (tab: LiveTab, saved: SessionTemplate) => {
  const edited = useTabDraftStore((state) => state.players[tab.tabId]);
  const setPlayers = useTabDraftStore((state) => state.setPlayers);
  const draft = useMemo(() => applyOverrides(saved, edited ? { ...tab.overrides, players: edited } : tab.overrides), [edited, saved, tab.overrides]);
  const latest = useRef(draft);
  latest.current = draft;
  const { tabId } = tab;

  const setDraft: Dispatch<SetStateAction<SessionTemplate>> = useCallback((next) => {
    const value = typeof next === 'function' ? next(latest.current) : next;
    latest.current = value;
    setPlayers(tabId, value.players);
  }, [setPlayers, tabId]);

  return { draft, setDraft };
};

export { useTabDraft };
