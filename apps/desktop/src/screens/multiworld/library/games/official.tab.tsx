/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../../views/GameStore';

const meta: ScreenMeta = { title: 'Official', icon: 'gamepad-2', order: 2, keywords: ['games', 'apworld', 'catalog'] };

const OfficialGamesTab = () => <GameStore tab="official" />;

export default OfficialGamesTab;
export { meta };
