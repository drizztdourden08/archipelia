/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { LobbyCreate } from '../../../../views/LobbyCreate';

const meta: ScreenMeta = { title: 'New lobby', icon: 'plus', path: 'new', keywords: ['create lobby', 'open lobby'] };

const CreateLobbySub = () => <LobbyCreate />;

export default CreateLobbySub;
export { meta };
