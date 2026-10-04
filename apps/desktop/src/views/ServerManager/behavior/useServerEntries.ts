/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSearchEntries } from '@drizztdourden08/brock-react';
import type { ServerEntry } from '@archipelia/model';
import { serverAnchor } from './server-anchor';

const useServerEntries = (servers: readonly ServerEntry[]): void => {
  const entries = useMemo(() => servers.map((server) => ({
    label: server.label,
    description: `Remote server at ${server.host}:${server.port}`,
    keywords: ['server', 'remote', 'ssh', server.host],
    anchor: serverAnchor(server.id),
  })), [servers]);
  useSearchEntries(entries);
};

export { useServerEntries };
