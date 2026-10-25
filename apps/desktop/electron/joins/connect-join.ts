/* @layer electron-main @kind logic */
import { joinAddress } from '../../src/lobbies/join-address';
import { openLobbyTransport } from '../lobbies/join/open-lobby-transport';

const connectJoin = (address: string) => {
  const parsed = joinAddress(address);
  return 'problem' in parsed ? Promise.reject(new Error(parsed.problem)) : openLobbyTransport(parsed.target);
};

export { connectJoin };
