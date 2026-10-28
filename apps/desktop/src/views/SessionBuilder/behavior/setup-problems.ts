/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { inPortRange, PORT_PROBLEM } from '@archipelia/design';
import { sessionReach } from '../../../lobbies/session-reach';
import { SETUP_TEXT } from '../SessionBuilder.constants';

const hostProblems = ({ host }: SessionTemplate): string[] => [
  ...(host.kind === 'local' && !inPortRange(host.port) ? [PORT_PROBLEM] : []),
  ...(host.kind === 'remote' && !host.serverId ? [SETUP_TEXT.noServer] : []),
];

const directProblems = (template: SessionTemplate): string[] => {
  if (!template.direct) return template.players.some((player) => player.direct) ? [SETUP_TEXT.directSeat] : [];
  const reach = sessionReach(template);
  return reach === 'gg' || reach === 'ssh' ? [SETUP_TEXT.directPlace] : [];
};

const setupProblems = (template: SessionTemplate): string[] => [
  ...(template.name.trim() ? [] : [SETUP_TEXT.noName]),
  ...hostProblems(template),
  ...directProblems(template),
];

export { setupProblems };
