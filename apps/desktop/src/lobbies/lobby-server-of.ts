/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { LOCAL_SERVER } from './lobbies.constants';

const lobbyServerOf = ({ lobby }: Pick<SessionTemplate, 'lobby'>): string => lobby?.serverId ?? LOCAL_SERVER;

export { lobbyServerOf };
