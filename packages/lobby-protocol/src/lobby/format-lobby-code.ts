/* @layer protocol @kind logic */
import { normalizeLobbyCode } from './normalize-lobby-code';

const formatLobbyCode = (input: string): string | null => {
  const code = normalizeLobbyCode(input);
  return code === null ? null : `${code.slice(0, 4)}-${code.slice(4)}`;
};

export { formatLobbyCode };
