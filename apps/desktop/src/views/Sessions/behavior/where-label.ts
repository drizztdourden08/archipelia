/* @layer renderer-app @kind logic */
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import { hostLabel } from '@archipelia/model';
import { sessionReach } from '../../../lobbies/session-reach';

const whereLabel = (template: SessionTemplate, servers: ServerEntry[]): string => {
  const reach = sessionReach(template);
  if (reach === 'local') return 'Local';
  if (reach === 'lan') return 'LAN';
  return hostLabel(template.host, servers);
};

export { whereLabel };
