/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { activeAfter } from '../live/active-after';
import { mergeTabs } from '../live/merge-tabs';
import { moveTab } from '../live/move-tab';
import type { LiveState } from './live-store.type';

const useLiveStore = createSessionStore<LiveState>((set, get) => ({
  tabs: [],
  activeId: null,
  loaded: false,
  load: async () => {
    get().apply(await appApi().liveList());
    set({ loaded: true });
  },
  apply: (incoming) => set((state) => {
    const tabs = mergeTabs(state.tabs, incoming);
    return { tabs, activeId: activeAfter(state.tabs, tabs, state.activeId) };
  }),
  include: (tab) => set((state) => ({ tabs: state.tabs.some((entry) => entry.tabId === tab.tabId) ? state.tabs.map((entry) => (entry.tabId === tab.tabId ? tab : entry)) : [...state.tabs, tab] })),
  activate: (tabId) => set((state) => (state.tabs.some((tab) => tab.tabId === tabId) ? { activeId: tabId } : state)),
  move: (from, to) => set((state) => ({ tabs: moveTab(state.tabs, from, to) })),
}));

export { useLiveStore };
