/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { LobbyList } from '../../../views/LobbyList';

const meta: ScreenMeta = {
  title: 'Lobbies',
  icon: 'users',
  order: 1,
  keywords: ['lobby', 'players', 'join', 'code', 'approve', 'host approval'],
  menu: 'entry',
  header: { primary: { label: 'New lobby', icon: 'plus', open: 'new' } },
};

const LobbiesPage = () => <LobbyList />;

export default LobbiesPage;
export { meta };
