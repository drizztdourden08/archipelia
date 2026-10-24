/* @layer electron-main @kind logic */
import type { LobbyServerEntry } from '@archipelia/model';
import { isPin } from '../../src/lobbies/is-pin';
import { serverUrlProblem } from '../../src/lobbies/server-url-problem';
import { BAD_ENTRY, BAD_PIN } from './lobbies.constants';

const checkLobbyServerEntry = (entry: LobbyServerEntry): void => {
  const texts = [entry.id, entry.label, entry.url].every((value) => typeof value === 'string');
  if (!texts || entry.label.trim() === '') throw new Error(BAD_ENTRY);
  const problem = serverUrlProblem(entry.url);
  if (problem) throw new Error(problem);
  if (entry.certSha256 !== undefined && !isPin(String(entry.certSha256))) throw new Error(BAD_PIN);
};

export { checkLobbyServerEntry };
