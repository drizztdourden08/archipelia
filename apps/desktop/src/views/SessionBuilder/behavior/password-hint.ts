/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { sessionReach } from '../../../lobbies/session-reach';
import { DIRECT_TEXT } from './place.constants';

const passwordHint = (draft: SessionTemplate): string => {
  if (sessionReach(draft) === 'archipelia') return DIRECT_TEXT.passwordRemote;
  return draft.server.passwordRef ? DIRECT_TEXT.passwordStored : DIRECT_TEXT.password.hint;
};

export { passwordHint };
