/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../../views/GameStore';

const meta: ScreenMeta = { title: 'All', icon: 'gamepad-2', order: 0, keywords: ['games', 'apworld', 'catalog', 'every world'] };

const AllGamesTab = () => <GameStore tab="all" />;

export default AllGamesTab;
export { meta };
