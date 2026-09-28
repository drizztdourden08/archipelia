/* @layer renderer-app @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { GameStore } from '../views/GameStore';

const gamesScreen = defineScreen({
  id: 'games',
  title: 'Games',
  group: 'library',
  render: () => <GameStore />,
});

export { gamesScreen };
