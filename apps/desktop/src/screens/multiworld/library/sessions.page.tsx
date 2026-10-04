/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { SessionsLibrary } from '../../../views/SessionsLibrary';

const meta: ScreenMeta = { title: 'Sessions', icon: 'layers', order: 1, keywords: ['templates', 'history', 'runs', 'new session', 'builder'] };

const SessionsPage = () => <SessionsLibrary />;

export default SessionsPage;
export { meta };
