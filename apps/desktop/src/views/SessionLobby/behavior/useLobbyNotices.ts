/* @layer renderer-app @kind hook */
import { LOBBY_TEXT } from './lobby-view.constants';
import { serverNotice } from './server-notice';
import { useLocalServerStatus } from '../../../hooks/useLocalServerStatus';
import { usePendingCloses } from '../../../hooks/usePendingCloses';
import { useServerPlace } from '../../../hooks/useServerPlace';
import type { LiveTab } from '../../../live/live.type';
import { ROOM_PASSWORDS_IN_MEMORY } from '../../../lobbies/lobbies.constants';

const useLobbyNotices = (tab: LiveTab): string[] => {
  const place = useServerPlace(tab.serverId);
  const { status } = useLocalServerStatus();
  const closing = usePendingCloses(tab.sessionId).length > 0;
  const server = serverNotice(place.local, status);
  const shown = server === ROOM_PASSWORDS_IN_MEMORY ? null : server;
  return [shown, closing ? LOBBY_TEXT.closing : null].filter((notice): notice is string => notice !== null);
};

export { useLobbyNotices };
