/* @layer renderer-app @kind component */
import { contextMenuHandler, contextMenuZone, focusRegion } from '@drizztdourden08/brock-react';
import { DocumentTabs } from '@drizztdourden08/tessera/composites';
import { Box, Flex } from '@drizztdourden08/tessera/primitives';
import { TAB_MENU, TABS_TEXT } from './SessionTabs.constants';
import { useSessionTabs } from './behavior/useSessionTabs';
import { IdleBase } from './sub-components/IdleBase';
import { SessionTab } from './sub-components/SessionTab';
import './SessionTabs.css';

const SessionTabs = () => {
  const model = useSessionTabs();
  const { active } = model;
  if (!active) return <IdleBase loaded={model.loaded} />;
  return (
    <Flex direction="column" className="session-tabs">
      <Box {...focusRegion(TABS_TEXT.label, TABS_TEXT.label)}>
        <Flex className="session-tabs__strip" {...contextMenuZone(TAB_MENU.zone)}>
          <DocumentTabs
            className="session-tabs__tabs"
            look="raised"
            label={TABS_TEXT.label}
            tabs={model.documents}
            activeId={active.tabId}
            onActivate={model.activate}
            onClose={model.close}
            onMove={model.move}
            onTabContextMenu={(tabId, event) => contextMenuHandler(TAB_MENU.zone, { tabId })(event)}
            overflowMenu
            onAdd={model.openSessions}
          />
        </Flex>
      </Box>
      <Box className="session-tabs__body"><SessionTab key={active.tabId} tab={active} /></Box>
    </Flex>
  );
};

export { SessionTabs };
