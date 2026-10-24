/* @layer core @kind logic */
import type { TrustedRoot } from '@sigstore/protobuf-specs';
import type { RegistryClient } from '../registry/registry.type';
import { readWorldGame } from './read-world-game';
import { sha256Hex } from './sha256-hex';
import { trustFail } from './trust-fail';
import { verifyProof } from './verify-proof';
import type { WorldVerdict } from './verify-world.type';

const verifyWorld = (bytes: Uint8Array, bundle: unknown, client: RegistryClient, trustedRoot: TrustedRoot): WorldVerdict => {
  const sha256 = sha256Hex(bytes);
  const proof = verifyProof(sha256, bundle, client, trustedRoot);
  if (!proof.ok) return proof;
  const game = readWorldGame(bytes);
  if (game === null) return trustFail('world-unreadable', 'the apworld has no readable archipelago.json');
  if (!client.games.includes(game)) return trustFail('game-mismatch', `${client.name} is not listed for the game ${game}`);
  return { ok: true, sha256, game, signer: proof.signer };
};

export { verifyWorld };
