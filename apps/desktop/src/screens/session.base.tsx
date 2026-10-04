/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { SessionDashboard } from '../views/SessionDashboard';

const meta: ScreenMeta = { title: 'Session', icon: 'radio' };

const SessionBase = () => <SessionDashboard />;

export default SessionBase;
export { meta };
