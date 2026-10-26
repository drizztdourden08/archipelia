/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { inPortRange, PORT_PROBLEM } from '@archipelia/design';
import { sessionReach } from '../../../lobbies/session-reach';
import { SETUP_TEXT } from '../SessionBuilder.constants';

const setupProblems = (template: SessionTemplate): string[] => {
  const { host, direct } = template;
  const reach = sessionReach(template);
  return [
    ...(template.name.trim() ? [] : [SETUP_TEXT.noName]),
    ...(host.kind === 'local' && !inPortRange(host.port) ? [PORT_PROBLEM] : []),
    ...(host.kind === 'remote' && !host.serverId ? [SETUP_TEXT.noServer] : []),
    ...(direct && (reach === 'gg' || reach === 'ssh') ? [SETUP_TEXT.directPlace] : []),
  ];
};

export { setupProblems };
