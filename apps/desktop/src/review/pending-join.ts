/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { LOBBY_STAGE } from './review.constants';

const pendingJoin = async (tour: AppReviewTour, lobby: AdminLobby): Promise<() => void> => {
  const api = appApi();
  const asked: number[] = [];
  const stop = api.onLobbyReviewHost((host) => {
    if (host.action === 'approve') asked.push(host.id);
    else void api.lobbyReviewHostDone(host.id);
  });
  void api.lobbyReviewPlay({ code: formatLobbyCode(lobby.code) ?? lobby.code, name: LOBBY_STAGE.session, ap: lobby.engine.ap }).catch(() => undefined).finally(stop);
  const waiting = await tour.waitFor(() => (asked.length > 0 ? true : null), 20000);
  tour.check('lobby-stage-join', waiting === true, 'a player joined the lobby and waits for approval', 'no player joined the lobby');
  return () => {
    for (const id of asked) void api.lobbyReviewHostDone(id);
  };
};

export { pendingJoin };
