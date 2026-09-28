/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import { DEFAULT_GAME_PORT } from '../ServerManager.constants';

const newServerEntry = (): ServerEntry => ({
  id: '', label: 'New server', host: '', port: 22, gamePort: DEFAULT_GAME_PORT, apPath: '/opt/archipelago',
  auth: { kind: 'ssh-key', username: '', keyPath: '' },
});

export { newServerEntry };
