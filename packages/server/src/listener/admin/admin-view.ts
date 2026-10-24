/* @layer core @kind logic */
import type { Lobby, WorldUpload } from '@archipelia/model';
import type { SandboxMode } from '../../sandbox/sandbox.type';
import { CONSENT_NOTES } from './admin.constants';

const worldView = (sandbox: SandboxMode, { proof, ...world }: WorldUpload) => ({
  ...world,
  proofSent: proof !== undefined,
  ...(world.trust.level === 'unlisted' ? { runsUnconfined: sandbox === 'none', consentNote: CONSENT_NOTES[sandbox] } : {}),
});

const adminView = (sandbox: SandboxMode, lobby: Lobby | undefined) => {
  if (!lobby) return null;
  return {
    ...lobby,
    members: lobby.members.map(({ tokenHash: _tokenHash, ...member }) => member),
    worlds: lobby.worlds.map((world) => worldView(sandbox, world)),
  };
};

export { adminView };
