/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { Sessions } from '../../../views/Sessions';

const meta: ScreenMeta = {
  title: 'Sessions',
  icon: 'layers',
  menu: 'entry',
  fill: true,
  keywords: ['saved sessions', 'new session', 'builder', 'players', 'direct connection', 'lobby', 'host approval', 'join a session', 'run once'],
  header: { primary: { label: 'New session', icon: 'plus', open: 'new' } },
};

const SessionsPage = () => <Sessions />;

export default SessionsPage;
export { meta };
