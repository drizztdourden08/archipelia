/* @layer testing @kind config */
import type { ApworldSpec, YamlSpec } from './kit.type';

const KIT_WORLDS: Record<string, ApworldSpec> = {
  W: { module: 'relic_of_the_past', game: 'Relic of the Past', worldVersion: '0.1.0', minimumAp: '0.6.4', size: 812345 },
  U: { module: 'unlisted_quest', game: 'Unlisted Quest', worldVersion: '1.0.0', size: 120000 },
};

const KIT_YAMLS: Record<string, YamlSpec> = {
  Y: { name: 'Link', game: 'Relic of the Past', size: 4210 },
  Y2: { name: 'Link2', game: 'Relic of the Past', size: 4300 },
  UY: { name: 'Zelda', game: 'Unlisted Quest', size: 3000 },
};

const KIT_BIG_SIZE = 83886080;

const KIT_PROOF = {
  method: 'github-attestation',
  bundle: {
    mediaType: 'application/vnd.dev.sigstore.bundle.v0.3+json',
    verificationMaterial: {},
    dsseEnvelope: {},
  },
};

export { KIT_BIG_SIZE, KIT_PROOF, KIT_WORLDS, KIT_YAMLS };
