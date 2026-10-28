/* @layer renderer-app @kind logic */
import type { DocumentTab } from '@drizztdourden08/tessera/composites';
import { lobbyOfTab } from '../../../live/lobby-of-tab';
import { runOfTab } from '../../../live/run-of-tab';
import { tabPhaseOf } from '../../../live/tab-phase-of';
import { TAB_STATUS } from '../../../live/tab-phase.constants';
import { TABS_TEXT } from '../SessionTabs.constants';
import type { TabDocumentsInput } from '../SessionTabs.type';

const tabDocuments = ({ tabs, templates, lobbies, runs }: TabDocumentsInput): DocumentTab[] =>
  tabs.map((tab) => {
    const title = templates.find((template) => template.id === tab.sessionId)?.name ?? TABS_TEXT.gone;
    const status = TAB_STATUS[tabPhaseOf(lobbyOfTab(lobbies, tab), runOfTab(runs, tab))];
    return { id: tab.tabId, title, status, tooltip: `${title}, ${status.label}` };
  });

export { tabDocuments };
