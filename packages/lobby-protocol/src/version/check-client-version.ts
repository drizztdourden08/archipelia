/* @layer protocol @kind logic */
import type { VersionedClient } from './check-client-version.type';
import type { Failure } from '../protocol/protocol.type';
import { parseApVersion } from './parse-ap-version';
import { compareApVersions } from './compare-ap-versions';

const sameVersion = (lobbyAp: string, clientAp: string): boolean =>
  parseApVersion(lobbyAp) !== null && parseApVersion(clientAp) !== null && compareApVersions(lobbyAp, clientAp) === 0;

const checkClientVersion = (lobbyAp: string, hello: VersionedClient): Failure | null => {
  const clientAp = hello.archipelago.version;
  if (sameVersion(lobbyAp, clientAp)) return null;
  const who = `${hello.client.name} ${hello.client.version}`;
  return {
    code: 'version-mismatch',
    message: `This lobby runs Archipelago ${lobbyAp}. ${who} runs Archipelago ${clientAp}. Switch to Archipelago ${lobbyAp} and join again.`,
    field: 'archipelago.version',
    lobbyAp,
  };
};

export { checkClientVersion };
