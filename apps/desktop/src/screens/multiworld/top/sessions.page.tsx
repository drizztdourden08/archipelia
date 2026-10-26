/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { SessionsLibrary } from '../../../views/SessionsLibrary';

const meta: ScreenMeta = {
  title: 'Sessions',
  icon: 'layers',
  menu: 'entry',
  menuOrder: 0,
  keywords: ['saved sessions', 'runs', 'new session', 'builder', 'direct connection', 'lobby', 'host approval', 'join a session'],
  header: { primary: { label: 'New session', icon: 'plus', open: 'new' }, search: { placeholder: 'Filter sessions and runs' } },
};

const SessionsPage = () => <SessionsLibrary />;

export default SessionsPage;
export { meta };
