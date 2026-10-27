/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo } from 'react';
import { nav } from '@drizztdourden08/brock-react';
import { ROUTE } from '../../../hooks/app-navigation.constants';
import { useLaunchWatcher } from '../../../hooks/useLaunchWatcher';
import { closeTab } from '../../../live/close-tab';
import { reloadRuns } from '../../../runs/reload-runs';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useLiveStore } from '../../../stores/useLiveStore';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { tabDocuments } from './tab-documents';
import { useStartOnHome } from './useStartOnHome';
import { useSessionViewFeed } from './useSessionViewFeed';
import { useTabLobbies } from './useTabLobbies';
import { useTabsMenu } from './useTabsMenu';

const openSessions = (): void => nav.open(ROUTE.sessions);

const useSessionTabs = () => {
  const { tabs, activeId, loaded, activate, move } = useLiveStore();
  const templates = useLibraryStore((state) => state.templates);
  const loadTemplates = useLibraryStore((state) => state.loadTemplates);
  const lobbies = useLobbyStore((state) => state.lobbies);
  const runs = useRunsStore((state) => state.runs);
  const active = tabs.find((tab) => tab.tabId === activeId);

  useEffect(reloadRuns, []);
  useEffect(() => { void loadTemplates().catch(() => undefined); }, [loadTemplates]);
  useTabLobbies(tabs);
  useTabsMenu();
  useLaunchWatcher();
  useSessionViewFeed(active);
  useStartOnHome(true, loaded, tabs.length > 0);

  const documents = useMemo(() => tabDocuments({ tabs, templates, lobbies, runs }), [tabs, templates, lobbies, runs]);
  const close = useCallback((tabId: string) => void closeTab(tabId), []);

  return { active, activate, close, documents, loaded, move, openSessions, tabs };
};

export { useSessionTabs };
