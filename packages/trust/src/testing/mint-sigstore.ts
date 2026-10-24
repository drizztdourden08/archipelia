/* @layer testing @kind logic */
import { generateKeyPairSync } from 'node:crypto';
import { bundleToJSON } from '@sigstore/bundle';
import { fulcioHandler, initializeCA, initializeCTLog, initializeTLog, rekorHandler } from '@sigstore/mock';
import { DSSEBundleBuilder, FulcioSigner, RekorWitness } from '@sigstore/sign';
import nock from 'nock';
import { adaptHandler } from './adapt-handler';
import { identityToken } from './identity-token';
import { HOUR } from './mint-sigstore.constants';
import type { Identity, MintedSigstore } from './mint.type';
import { trustedRootOf } from './trusted-root-of';

const keyPair = () => generateKeyPairSync('ec', { namedCurve: 'prime256v1' });

const mintSigstore = async (): Promise<MintedSigstore> => {
  nock.disableNetConnect();
  const logKey = keyPair();
  const ctKey = keyPair();
  const ca = await initializeCA(keyPair(), await initializeCTLog(ctKey));
  const fulcio = fulcioHandler(ca);
  const rekor = rekorHandler(await initializeTLog('https://rekor.test', logKey));
  nock('https://fulcio.test').persist().post(fulcio.path).reply(adaptHandler(fulcio));
  nock('https://rekor.test').persist().post(rekor.path).reply(adaptHandler(rekor));
  const start = new Date(Date.now() - 2 * HOUR);
  const parts = { logKey, ctKey, caCertificate: ca.rootCertificate, start };
  const attest = async (statement: unknown, identity: Identity) => {
    const builder = new DSSEBundleBuilder({
      signer: new FulcioSigner({ identityProvider: { getToken: () => Promise.resolve(identityToken(identity)) }, fulcioBaseURL: 'https://fulcio.test' }),
      witnesses: [new RekorWitness({ rekorBaseURL: 'https://rekor.test', entryType: 'intoto' })],
    });
    const bundle = await builder.create({ data: Buffer.from(JSON.stringify(statement)), type: 'application/vnd.in-toto+json' });
    return bundleToJSON(bundle);
  };
  return {
    trustedRoot: trustedRootOf(parts),
    expiredRoot: trustedRootOf({ ...parts, end: new Date(Date.now() - HOUR) }),
    attest,
  };
};

export { mintSigstore };
