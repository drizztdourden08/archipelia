/* @layer renderer-app @kind logic */
import type { DirectConnection, SessionTemplate } from '@archipelia/model';
import { sessionReach } from '../../../lobbies/session-reach';
import type { DirectState } from '../SessionBuilder.type';
import { DIRECT_TEXT } from './place.constants';

const optionsOf = (direct: DirectConnection | undefined) => ({
  on: direct !== undefined,
  approval: direct?.admission === 'host-approval',
  unlisted: direct?.allowUnlisted === true,
});

const directState = (draft: SessionTemplate, live: boolean, busy: boolean): DirectState => {
  const reach = sessionReach(draft);
  const remote = reach === 'gg' || reach === 'ssh';
  const options = optionsOf(draft.direct);
  const locked = busy || live;
  return {
    ...options,
    allowOff: locked || (remote && !options.on),
    optionsOff: locked || !options.on,
    hint: live ? DIRECT_TEXT.live : DIRECT_TEXT.reach[reach],
    problem: remote && options.on ? DIRECT_TEXT.mismatch : undefined,
  };
};

export { directState };
