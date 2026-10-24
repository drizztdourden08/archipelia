/* @layer core @kind logic */
import type { Hello } from '@archipelia/lobby-protocol';
import type { ClientMeta } from '@archipelia/model';

const clientMeta = ({ client, archipelago, capabilities }: Hello): ClientMeta => ({
  id: client.id,
  name: client.name,
  version: client.version,
  platform: { os: client.platform.os, arch: client.platform.arch },
  archipelago: archipelago.version,
  capabilities,
  ...(client.build === undefined ? {} : { build: client.build }),
  ...(client.homepage === undefined ? {} : { homepage: client.homepage }),
});

export { clientMeta };
