/* @layer renderer-app @kind logic */
import { isPin } from '../../../lobbies/is-pin';
import { serverUrlProblem } from '../../../lobbies/server-url-problem';
import { PROBLEM } from '../ArchipeliaServers.constants';
import type { DraftProblem, ServerDraft } from '../ArchipeliaServers.type';

const draftProblems = ({ label, url, token, pin }: ServerDraft): DraftProblem[] => {
  const problems: DraftProblem[] = [];
  if (!label.trim()) problems.push({ field: 'label', message: PROBLEM.label });
  const urlProblem = serverUrlProblem(url);
  if (urlProblem) problems.push({ field: 'url', message: urlProblem });
  if (!token) problems.push({ field: 'token', message: PROBLEM.token });
  if (pin.trim() && !isPin(pin)) problems.push({ field: 'pin', message: PROBLEM.pin });
  return problems;
};

export { draftProblems };
