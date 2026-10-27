/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { GameStore } from '../../../../views/GameStore';

const meta: ScreenMeta = { title: 'Built-in', icon: 'gamepad-2', order: 2, keywords: ['games', 'apworld', 'catalog', 'official'] };

const BuiltInGamesTab = () => <GameStore tab="built-in" />;

export default BuiltInGamesTab;
export { meta };
