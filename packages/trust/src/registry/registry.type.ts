/* @layer core @kind types */

type ClientStatus = 'active' | 'revoked';

type GithubAttestationTrust = {
  method: 'github-attestation';
  repo: string;
  workflow: string;
  refs: string[];
  issuer: string;
};

type ClientTrust = GithubAttestationTrust;

type RegistryClient = {
  id: string;
  name: string;
  homepage: string;
  games: string[];
  status: ClientStatus;
  trust: ClientTrust;
};

type ReleaseKind = 'builds';

type RegistryRelease = { repo: string; repoId?: number; world: string; manifest: string; bundle: string; kind?: ReleaseKind };

type RegistryGame = {
  game: string;
  module: string;
  displayName: string;
  home: string;
  tags: string[];
  client: string;
  release: RegistryRelease;
};

type RegistryBlocked = { repoId: number; reason?: string };

type Registry = { format: 1; clients: RegistryClient[]; games: RegistryGame[]; blocked: RegistryBlocked[] };

export type { ClientStatus, ClientTrust, GithubAttestationTrust, Registry, RegistryBlocked, RegistryClient, RegistryGame, RegistryRelease, ReleaseKind };
