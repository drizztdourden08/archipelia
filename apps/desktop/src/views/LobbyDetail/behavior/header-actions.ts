/* @layer renderer-app @kind logic */
import type { ActionItem } from '@drizztdourden08/tessera/composites';
import type { AdminLobby } from '@archipelia/model';
import type { LobbyDetailModel } from '../LobbyDetail.type';
import { lobbyActions } from './lobby-actions';

const headerActions = (lobby: AdminLobby, model: LobbyDetailModel): ActionItem[] => {
  const can = lobbyActions(lobby);
  const busy = model.isBusy();
  const items: ActionItem[] = [];
  if (can.lock) items.push({ id: 'lock', label: 'Lock', icon: 'lock', onSelect: () => void model.lock(), disabled: busy });
  if (can.stopRoom) {
    items.push({ id: 'stop-room', label: 'Stop room', icon: 'square', onSelect: () => void model.stopRoom(), disabled: busy, kind: 'danger', confirm: { title: `Stop the room of ${lobby.name}?`, confirmLabel: 'Stop room' } });
  }
  if (can.close) {
    items.push({ id: 'close', label: 'Close lobby', icon: 'x', onSelect: () => void model.close(), disabled: busy, kind: 'danger', confirm: { title: `Close ${lobby.name}?`, confirmLabel: 'Close lobby' } });
  }
  if (can.start) items.push({ id: 'start', label: lobby.phase === 'failed' ? 'Start again' : 'Start', icon: 'play', onSelect: () => void model.start(), disabled: busy || can.startBlock !== null, kind: 'primary' });
  return items;
};

export { headerActions };
