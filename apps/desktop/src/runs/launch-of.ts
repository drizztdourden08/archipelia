/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyTemplateId } from '@archipelia/model';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import type { RunLaunch } from './run-launch.type';

const launchOf = ({ lobby }: SessionTemplate, startedAt: number): RunLaunch | null =>
  ((lobby?.serverId ?? LOCAL_SERVER) === LOCAL_SERVER && lobby?.lobbyId ? { templateId: lobbyTemplateId(lobby.lobbyId), startedAt } : null);

export { launchOf };
