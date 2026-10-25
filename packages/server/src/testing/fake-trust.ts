/* @layer core @kind logic */
import type { Registry } from '@archipelia/trust';
import type { LobbyTrust } from '../lobby/lobby-service.type';
import { SIGNER } from './testing.constants';

const registryOf = (status: 'active' | 'revoked'): Registry => ({
  format: 1,
  games: [],
  clients: [{
    id: 'relic-of-the-past', name: 'Relic of the Past', homepage: 'https://github.com/drizztdourden08/relic-of-the-past', games: ['Relic of the Past'], status,
    trust: { method: 'github-attestation', repo: 'drizztdourden08/relic-of-the-past', workflow: '.github/workflows/release.yml', refs: ['refs/heads/main'], issuer: 'https://token.actions.githubusercontent.com' },
  }],
});

const fakeTrust = (status: 'active' | 'revoked', proofFails = false, world?: () => Promise<void>): LobbyTrust => ({
  registry: () => Promise.resolve(registryOf(status)),
  verifyProof: () => Promise.resolve(proofFails ? { ok: false, code: 'trust-failed', reason: 'chain-invalid', detail: 'test' } : { ok: true, signer: SIGNER }),
  verifyWorld: async () => {
    await world?.();
    return { ok: true, sha256: '', game: 'Relic of the Past', signer: SIGNER };
  },
});

export { fakeTrust };
