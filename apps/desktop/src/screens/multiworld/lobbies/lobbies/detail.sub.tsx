/* @layer renderer-app @kind component */
import type { ScreenMeta, SubPageProps } from '@drizztdourden08/brock-react';
import { LobbyDetail } from '../../../../views/LobbyDetail';

const meta: ScreenMeta = { title: 'Lobby', icon: 'users', path: ':serverId/:id' };

const LobbyDetailSub = ({ subParams }: SubPageProps) => <LobbyDetail serverId={subParams.serverId ?? ''} lobbyId={subParams.id ?? ''} />;

export default LobbyDetailSub;
export { meta };
