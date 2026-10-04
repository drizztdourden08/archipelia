/* @layer electron-main @kind logic */
import { randomUUID } from 'node:crypto';
import type { HostTarget } from '@archipelia/model';
import { createGgHost, createLocalHost, createRemoteHost } from '@archipelia/hosts';
import type { SessionHost } from '@archipelia/hosts';
import type { HostFactoryDeps, SecretStore } from './host-factory.type';
import { GG_OWNER_SECRET } from '../../src/secrets/secret-names.constants';
import { lanAddress } from './lan-address';
import { credentialsOf } from './server-credentials';

const ggOwnerId = async (secrets: SecretStore) => {
  const existing = await secrets.get(GG_OWNER_SECRET);
  if (existing) return existing;
  const created = randomUUID();
  await secrets.set(GG_OWNER_SECRET, created, 'archipelago.gg room owner id');
  return created;
};

const createHostFactory = ({ runtime, secrets, servers }: HostFactoryDeps) =>
  async (target: HostTarget): Promise<SessionHost> => {
    if (target.kind === 'local') {
      return createLocalHost({ runtime: await runtime(), port: target.port, advertiseHost: lanAddress() });
    }
    if (target.kind === 'archipelago-gg') {
      return createGgHost({ ownerId: await ggOwnerId(secrets), baseUrl: target.baseUrl });
    }
    const entry = await servers.require(target.serverId);
    if (!entry.hostKeySha256) throw new Error(`${entry.label}: test the server and trust its host key first`);
    return createRemoteHost({ entry, credentials: await credentialsOf(entry, secrets), onHostKey: () => false });
  };

export { createHostFactory };
