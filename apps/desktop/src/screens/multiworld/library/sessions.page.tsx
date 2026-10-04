/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { SessionsLibrary } from '../../../views/SessionsLibrary';

const meta: ScreenMeta = {
  title: 'Sessions',
  icon: 'layers',
  order: 1,
  keywords: ['saved sessions', 'runs', 'new session', 'builder'],
  menu: 'entry',
  header: { primary: { label: 'New session', icon: 'plus', open: 'new' }, search: { placeholder: 'Filter sessions and runs' } },
};

const SessionsPage = () => <SessionsLibrary />;

export default SessionsPage;
export { meta };
