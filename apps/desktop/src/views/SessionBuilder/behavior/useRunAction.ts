/* @layer renderer-app @kind hook */
import type { SessionTemplate } from '@archipelia/model';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import type { RunAction } from '../SessionBuilder.type';
import { runAction } from './run-action';

const useRunAction = (draft: SessionTemplate, run: () => void, open: () => void): RunAction => {
  const serverId = draft.direct?.serverId;
  const lobbies = useLobbyStore((state) => (serverId === undefined ? undefined : state.lobbies[serverId]));
  return runAction(draft, lobbies, { run, open });
};

export { useRunAction };
