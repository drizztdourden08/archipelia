/* @layer electron-main @kind logic */
import type { AdminLobby } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import type { LinkEvent, RequestBook } from '../lobbies.type';
import { parseAdminMessage } from './parse-admin-message';
import { CLOSED_TEXT, REFUSED_TEXT } from './remote.constants';

const routeAdminEvent = (event: LinkEvent, book: RequestBook, watchers: ReadonlySet<(lobby: AdminLobby) => void>): void => {
  if (event.kind === 'close') return book.failAll(new Error(CLOSED_TEXT));
  const message = event.kind === 'text' ? parseAdminMessage(event.text) : null;
  if (!message) return undefined;
  if (message.type === 'lobby.detail' && isRecord(message.lobby)) {
    for (const watcher of watchers) watcher(message.lobby as AdminLobby);
    return undefined;
  }
  if (message.type === 'error') return book.failAll(new Error(String(message.message ?? REFUSED_TEXT)));
  return book.settle(message);
};

export { routeAdminEvent };
