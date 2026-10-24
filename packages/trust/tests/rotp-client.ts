/* @layer tests @kind helper */
import registryFile from 'archipelia/registry/registry.json' with { type: 'json' };
import { findClient } from '../src/registry/find-client';
import { parseRegistry } from '../src/registry/parse-registry';
import type { RegistryClient } from '../src/registry/registry.type';

const rotpClient = (): RegistryClient => {
  const parsed = parseRegistry(registryFile);
  const client = parsed.ok ? findClient(parsed.registry, 'relic-of-the-past') : undefined;
  if (!client) throw new Error('the registry has no relic-of-the-past entry');
  return client;
};

export { rotpClient };
