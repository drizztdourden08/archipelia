/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../../views/GameStore';

const meta: ScreenMeta = { title: 'Installed', icon: 'gamepad-2', order: 1, keywords: ['games', 'apworld', 'installed worlds'] };

const InstalledGamesTab = () => <GameStore tab="installed" />;

export default InstalledGamesTab;
export { meta };
