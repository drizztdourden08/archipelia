/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { SessionsLibrary } from '../../../views/SessionsLibrary';

const meta: ScreenMeta = {
  title: 'Sessions',
  icon: 'layers',
  menu: 'entry',
  keywords: ['saved sessions', 'new session', 'builder', 'direct connection', 'lobby', 'host approval', 'join a session'],
  header: { primary: { label: 'New session', icon: 'plus', open: 'new' }, search: { placeholder: 'Filter sessions' } },
};

const SessionsPage = () => <SessionsLibrary />;

export default SessionsPage;
export { meta };
