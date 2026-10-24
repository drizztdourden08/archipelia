/* @layer renderer-app @kind logic */
import type { LanEntry } from '../../../lobbies/lobbies.type';
import type { LanMatch, LanRow } from '../ArchipeliaServers.type';

const matchOf = (ap: string | undefined, server: LanEntry): LanMatch => {
  if (ap === undefined) return 'unknown';
  return server.ap === ap ? 'same' : 'different';
};

const lanRows = (servers: readonly LanEntry[], ap: string | undefined): LanRow[] =>
  servers
    .map((server) => ({
      id: server.id, name: server.name, address: `${server.host}:${server.port}`, ap: server.ap, open: server.open, self: server.self, match: matchOf(ap, server),
    }))
    .sort((a, b) => Number(b.self) - Number(a.self) || a.name.localeCompare(b.name));

export { lanRows };
