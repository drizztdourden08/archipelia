/* @layer core @kind logic */
import type { Registry, RegistryClient } from './registry.type';

const findClient = (registry: Registry, id: string): RegistryClient | undefined =>
  registry.clients.find((client) => client.id === id);

export { findClient };
