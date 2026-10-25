/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { SessionBuilder } from '../../../../views/SessionBuilder';

const meta: ScreenMeta = { title: 'New session', icon: 'plus', path: 'new', keywords: ['builder', 'players', 'create session'] };

const CreateSessionSub = () => <SessionBuilder />;

export default CreateSessionSub;
export { meta };
