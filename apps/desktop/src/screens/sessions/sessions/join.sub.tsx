/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { JoinSession } from '../../../views/JoinSession';

const meta: ScreenMeta = { title: 'Join a session', icon: 'log-in', path: 'join', keywords: ['join', 'lobby', 'session code', 'play', 'servers on your network', 'join a lobby'] };

const JoinSessionSub = () => <JoinSession />;

export default JoinSessionSub;
export { meta };
