/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyRef } from '@drizztdourden08/archipelia-lobby-protocol';
import { joinTokenNotFoundFailure, lobbyNotFoundFailure, normalizeLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { LobbyContext } from '../lobby-context.type';
import type { Outcome } from '../lobby-service.type';

const findLobby = async (book: LobbyContext['book'], ref: LobbyRef): Promise<Outcome<Lobby>> => {
  if (ref.joinToken !== undefined) {
    const listed = await book.byJoinToken(ref.joinToken);
    return listed ? { ok: true, value: listed } : { ok: false, failure: joinTokenNotFoundFailure() };
  }
  const code = normalizeLobbyCode(ref.code);
  const lobby = code === null ? undefined : await book.byCode(code);
  return lobby ? { ok: true, value: lobby } : { ok: false, failure: lobbyNotFoundFailure() };
};

export { findLobby };
