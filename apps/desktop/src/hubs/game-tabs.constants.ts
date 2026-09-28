/* @layer renderer-app @kind config */
import { createElement } from 'react';
import { GameStore } from '../views/GameStore';
import { hubTab } from './hub-tab';

const GAME_TABS = [
  hubTab('installed', 'Installed', () => createElement(GameStore, { tab: 'installed' })),
  hubTab('official', 'Official', () => createElement(GameStore, { tab: 'official' })),
  hubTab('community', 'Community', () => createElement(GameStore, { tab: 'community' })),
  hubTab('updates', 'Updates', () => createElement(GameStore, { tab: 'updates' })),
];

export { GAME_TABS };
