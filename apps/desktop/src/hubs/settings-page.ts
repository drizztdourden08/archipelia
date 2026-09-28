/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import { settingsTabPage } from '@drizztdourden08/brock-react';
import type { HubPage } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import { SETTINGS_TABS } from '../settings.constants';

const settingsPage = (tabId: string, icon: IconName): HubPage => {
  const tab = SETTINGS_TABS.find((entry) => entry.id === tabId);
  if (!tab) throw new Error(`No settings tab "${tabId}"`);
  return settingsTabPage(tab, createElement(Icon, { name: icon }));
};

export { settingsPage };
