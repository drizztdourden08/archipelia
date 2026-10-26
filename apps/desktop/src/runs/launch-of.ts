/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyTemplateId } from '@archipelia/model';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import type { RunLaunch } from './run-launch.type';

const launchOf = ({ id, direct }: SessionTemplate, startedAt: number): RunLaunch | null => {
  if (!direct) return { templateId: id, startedAt };
  return direct.serverId === LOCAL_SERVER && direct.lobbyId ? { templateId: lobbyTemplateId(direct.lobbyId), startedAt } : null;
};

export { launchOf };
