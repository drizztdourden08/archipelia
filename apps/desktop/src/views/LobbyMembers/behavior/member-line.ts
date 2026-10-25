/* @layer renderer-app @kind logic */
import type { AdminLobbyMember } from '@archipelia/model';

const memberLine = (member: AdminLobbyMember): string => {
  if (member.kind === 'host') return 'Host player';
  return member.client ? `${member.client.name} ${member.client.version}` : 'Unknown client';
};

export { memberLine };
