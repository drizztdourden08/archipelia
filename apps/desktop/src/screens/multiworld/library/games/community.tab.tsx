/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../../views/GameStore';

const meta: ScreenMeta = { title: 'Community', icon: 'gamepad-2', order: 3, keywords: ['games', 'apworld', 'catalog'] };

const CommunityGamesTab = () => <GameStore tab="community" />;

export default CommunityGamesTab;
export { meta };
