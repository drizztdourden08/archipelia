/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../../views/GameStore';

const meta: ScreenMeta = { title: 'Archipelago index', icon: 'gamepad-2', order: 4, keywords: ['games', 'apworld', 'catalog', 'community'] };

const ArchipelagoIndexGamesTab = () => <GameStore tab="archipelago-index" />;

export default ArchipelagoIndexGamesTab;
export { meta };
