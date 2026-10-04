/* @layer core @kind logic */
import { randomUUID } from 'node:crypto';
import type { HostTarget } from '@archipelia/model';
import { createGgHost } from '../gg-host/gg-host';
import { createLocalHost } from '../local/local-host';
import { createRemoteHost } from '../remote/remote-host';
import type { SessionHost } from '../session-host.type';
import { credentialsOf } from './credentials-of';
import type { HostFactoryDeps, SecretStore } from './servers.type';

const ggOwnerId = async (secrets: SecretStore, name: string) => {
  const existing = await secrets.get(name);
  if (existing) return existing;
  const created = randomUUID();
  await secrets.set(name, created, 'archipelago.gg room owner id');
  return created;
};

const createHostFactory = ({ runtime, secrets, servers, advertiseHost, ggOwnerSecret }: HostFactoryDeps) =>
  async (target: HostTarget): Promise<SessionHost> => {
    if (target.kind === 'local') {
      return createLocalHost({ runtime: await runtime(), port: target.port, advertiseHost: advertiseHost() });
    }
    if (target.kind === 'archipelago-gg') {
      return createGgHost({ ownerId: await ggOwnerId(secrets, ggOwnerSecret), baseUrl: target.baseUrl });
    }
    const entry = await servers.require(target.serverId);
    if (!entry.hostKeySha256) throw new Error(`${entry.label}: test the server and trust its host key first`);
    return createRemoteHost({ entry, credentials: await credentialsOf(entry, secrets), onHostKey: () => false });
  };

export { createHostFactory };
