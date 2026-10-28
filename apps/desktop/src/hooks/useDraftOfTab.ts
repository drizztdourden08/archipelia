/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { draftOf } from '../live/draft-of';
import type { LiveTab } from '../live/live.type';
import { useLibraryStore } from '../stores/useLibraryStore';
import { useTabDraftStore } from '../stores/useTabDraftStore';

const useDraftOfTab = (tab: LiveTab | undefined): SessionTemplate | undefined => {
  const saved = useLibraryStore((state) => state.templates.find((template) => template.id === tab?.sessionId));
  const edited = useTabDraftStore((state) => (tab ? state.players[tab.tabId] : undefined));
  return useMemo(() => (tab && saved ? draftOf(tab, saved, edited) : undefined), [edited, saved, tab]);
};

export { useDraftOfTab };
