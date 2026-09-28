/* @layer core @kind logic */
import type { ServerSettings } from '@archipelia/model';

const serverArgs = (server: ServerSettings, port: number, bindHost: string) => [
  '--host', bindHost,
  '--port', String(port),
  '--hint_cost', String(server.hintCost),
  '--release_mode', server.releaseMode,
  '--collect_mode', server.collectMode,
  '--remaining_mode', server.remainingMode,
  '--auto_shutdown', String(server.autoShutdownMinutes),
];

export { serverArgs };
