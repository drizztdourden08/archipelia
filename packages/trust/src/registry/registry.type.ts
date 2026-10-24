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

type RegistryRelease = { repo: string; world: string; manifest: string; bundle: string };

type RegistryGame = {
  game: string;
  module: string;
  displayName: string;
  home: string;
  tags: string[];
  client: string;
  release: RegistryRelease;
};

type Registry = { format: 1; clients: RegistryClient[]; games: RegistryGame[] };

export type { ClientStatus, ClientTrust, GithubAttestationTrust, Registry, RegistryClient, RegistryGame, RegistryRelease };
