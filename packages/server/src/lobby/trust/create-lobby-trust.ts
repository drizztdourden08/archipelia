/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import { loadRegistry, loadTrustedRoot, verifyProof, verifyWorld } from '@archipelia/trust';
import type { LobbyTrust } from '../lobby-service.type';

const createLobbyTrust = (cache: DataFiles): LobbyTrust => {
  const trustedRoot = async () => (await loadTrustedRoot({ files: cache })).root;
  return {
    registry: async () => (await loadRegistry({ files: cache })).registry,
    verifyProof: async (sha256, bundle, client) => verifyProof(sha256, bundle, client, await trustedRoot()),
    verifyWorld: async (bytes, bundle, client) => verifyWorld(bytes, bundle, client, await trustedRoot()),
  };
};

export { createLobbyTrust };
