/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { SessionTabs } from '../views/SessionTabs';

const meta: ScreenMeta = { title: 'Session', icon: 'radio' };

const SessionBase = () => <SessionTabs />;

export default SessionBase;
export { meta };
