/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../../views/GameStore';

const meta: ScreenMeta = { title: 'Archipelia ready', icon: 'gamepad-2', order: 3, keywords: ['games', 'apworld', 'catalog', 'verified'] };

const ArchipeliaReadyGamesTab = () => <GameStore tab="archipelia-ready" />;

export default ArchipeliaReadyGamesTab;
export { meta };
