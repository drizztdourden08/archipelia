/* @layer renderer-app @kind logic */
import { lobbyTemplateId } from '@archipelia/model';
import type { LiveTab } from '../live/live.type';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import type { RunLaunch } from './run-launch.type';

const launchOf = ({ serverId, lobbyId }: Pick<LiveTab, 'serverId' | 'lobbyId'>, startedAt: number): RunLaunch | null =>
  (serverId === LOCAL_SERVER ? { templateId: lobbyTemplateId(lobbyId), startedAt } : null);

export { launchOf };
