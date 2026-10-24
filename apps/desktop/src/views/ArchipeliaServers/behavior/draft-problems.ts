/* @layer renderer-app @kind logic */
import { isPin } from '../../../lobbies/is-pin';
import { parseServerUrl } from '../../../lobbies/parse-server-url';
import { PROBLEM } from '../ArchipeliaServers.constants';
import type { DraftProblem, ServerDraft } from '../ArchipeliaServers.type';

const draftProblems = ({ label, url, token, pin }: ServerDraft): DraftProblem[] => {
  const problems: DraftProblem[] = [];
  if (!label.trim()) problems.push({ field: 'label', message: PROBLEM.label });
  if (!parseServerUrl(url)) problems.push({ field: 'url', message: PROBLEM.url });
  if (!token) problems.push({ field: 'token', message: PROBLEM.token });
  if (pin.trim() && !isPin(pin)) problems.push({ field: 'pin', message: PROBLEM.pin });
  return problems;
};

export { draftProblems };
