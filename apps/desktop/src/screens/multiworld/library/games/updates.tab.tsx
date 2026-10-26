/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../../views/GameStore';

const meta: ScreenMeta = { title: 'Updates', icon: 'gamepad-2', order: 4, keywords: ['games', 'apworld', 'new versions'] };

const UpdatesGamesTab = () => <GameStore tab="updates" />;

export default UpdatesGamesTab;
export { meta };
