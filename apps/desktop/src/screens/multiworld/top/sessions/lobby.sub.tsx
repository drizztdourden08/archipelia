/* @layer renderer-app @kind component */
import type { ScreenMeta, SubPageProps } from '@drizztdourden08/brock-react';
import { SessionLobby } from '../../../../views/SessionLobby';

const meta: ScreenMeta = { title: 'Session lobby', icon: 'users', path: ':id/lobby', keywords: ['lobby', 'players', 'run', 'start session', 'host approval'] };

const SessionLobbySub = ({ subParams }: SubPageProps) => <SessionLobby templateId={subParams.id ?? ''} />;

export default SessionLobbySub;
export { meta };
