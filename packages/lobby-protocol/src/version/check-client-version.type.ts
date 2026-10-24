/* @layer protocol @kind types */

type VersionedClient = {
  client: { name: string; version: string };
  archipelago: { version: string };
};

export type { VersionedClient };
