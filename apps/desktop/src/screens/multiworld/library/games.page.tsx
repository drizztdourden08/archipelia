/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../views/GameStore';

const meta: ScreenMeta = { title: 'Games', icon: 'gamepad-2', order: 2, keywords: ['apworld', 'install', 'catalog', 'worlds', 'library'], menu: 'Library', showHeader: true, fill: true };

const GamesPage = () => <GameStore />;

export default GamesPage;
export { meta };
