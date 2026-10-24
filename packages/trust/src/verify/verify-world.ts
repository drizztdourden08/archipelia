/* @layer core @kind logic */
import type { TrustedRoot } from '@sigstore/protobuf-specs';
import type { RegistryClient } from '../registry/registry.type';
import { checkSignature } from './check-signature';
import { checkStatement } from './check-statement';
import { readBundle } from './read-bundle';
import { readWorldGame } from './read-world-game';
import { sha256Hex } from './sha256-hex';
import { trustFail } from './trust-fail';
import type { WorldVerdict } from './verify-world.type';

const verifyWorld = (bytes: Uint8Array, bundle: unknown, client: RegistryClient, trustedRoot: TrustedRoot): WorldVerdict => {
  if (client.status === 'revoked') return trustFail('revoked', `${client.name} is revoked in the registry`);
  const read = readBundle(bundle);
  if ('ok' in read) return read;
  const sha256 = sha256Hex(bytes);
  const statement = checkStatement(read.bundle, sha256);
  if (statement) return statement;
  const signed = checkSignature(read.bundle, client.trust, trustedRoot);
  if ('ok' in signed) return signed;
  const game = readWorldGame(bytes);
  if (game === null) return trustFail('world-unreadable', 'the apworld has no readable archipelago.json');
  if (!client.games.includes(game)) return trustFail('game-mismatch', `${client.name} is not listed for the game ${game}`);
  return { ok: true, sha256, game, signer: signed.signer };
};

export { verifyWorld };
