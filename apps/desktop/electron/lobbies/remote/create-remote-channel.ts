/* @layer electron-main @kind logic */
import type { AdminLobby } from '@archipelia/model';
import type { ServerInfo } from '../../../src/lobbies/lobbies.type';
import type { AdminChannel, AdminLink } from '../lobbies.type';
import { createRequestBook } from './create-request-book';
import { routeAdminEvent } from './route-admin-event';
import { CLOSED_TEXT } from './remote.constants';

const createRemoteChannel = async (link: AdminLink, token: string): Promise<{ channel: AdminChannel; info: ServerInfo }> => {
  const book = createRequestBook(link);
  const watchers = new Set<(lobby: AdminLobby) => void>();

  link.listen((event) => routeAdminEvent(event, book, watchers));

  const welcome = await book.request({ type: 'admin.hello', token });
  const call = async (type: string, params: Record<string, unknown> = {}): Promise<unknown> => {
    const reply = await book.request({ ...params, type });
    if (reply.ok !== true) throw new Error(String(reply.error ?? 'The server refused the request.'));
    return reply.result;
  };
  const channel: AdminChannel = {
    call,
    watch: (listener) => {
      watchers.add(listener);
      return () => watchers.delete(listener);
    },
    close: () => {
      book.failAll(new Error(CLOSED_TEXT));
      link.close();
    },
    alive: book.alive,
  };
  return { channel, info: welcome.server as ServerInfo };
};

export { createRemoteChannel };
