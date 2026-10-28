/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { strToU8, zipSync } from 'fflate';
import type { CatalogEntry } from '@archipelia/model';

const REPO = 'drizztdourden08/relic-of-the-past';

const BASE = `https://github.com/${REPO}/releases/latest/download`;

const WORLD_URL = `${BASE}/relic_of_the_past.apworld`;

const MANIFEST_URL = `${BASE}/relic_of_the_past.apworld.json`;

const STANDARD_URL = `${BASE}/archipelia.json`;

const BUNDLE_URL = `${BASE}/relic_of_the_past.apworld.sigstore.json`;

const REGISTRY_URL = 'https://raw.githubusercontent.com/drizztdourden08/archipelia/main/registry/registry.json';

const buildUrl = (ap: string) => `${BASE}/relic_of_the_past-ap${ap}.apworld`;

const buildBundleUrl = (ap: string) => `${buildUrl(ap)}.sigstore.json`;

const registryOf = (status: 'active' | 'revoked' = 'active', kind?: 'builds') => ({
  format: 1,
  clients: [
    {
      id: 'relic-of-the-past',
      name: 'Relic of the Past',
      homepage: `https://github.com/${REPO}`,
      games: ['Relic of the Past'],
      status,
      trust: {
        method: 'github-attestation',
        repo: REPO,
        workflow: '.github/workflows/release.yml',
        refs: ['refs/heads/main'],
        issuer: 'https://token.actions.githubusercontent.com',
      },
    },
  ],
  games: [
    {
      game: 'Relic of the Past',
      module: 'relic_of_the_past',
      displayName: 'Relic of the Past',
      home: `https://github.com/${REPO}`,
      tags: ['action', 'adventure'],
      client: 'relic-of-the-past',
      release: {
        repo: REPO,
        world: 'relic_of_the_past.apworld',
        manifest: 'relic_of_the_past.apworld.json',
        bundle: 'relic_of_the_past.apworld.sigstore.json',
        ...(kind ? { kind } : {}),
      },
    },
  ],
});

const worldBytes = (tag = 'world') => zipSync({
  'relic_of_the_past/__init__.py': strToU8(`# ${tag}`),
  'relic_of_the_past/archipelago.json': strToU8(JSON.stringify({ game: 'Relic of the Past', world_version: '0.1.0' })),
});

const sha256Of = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

const manifestOf = (bytes: Uint8Array, patch: Record<string, unknown> = {}) => ({
  game: 'Relic of the Past', worldVersion: '0.1.0', minimumAp: '0.6.4', sha256: sha256Of(bytes), appVersion: '0.1.0', ...patch,
});

const buildsManifestOf = (builds: { ap: string; bytes: Uint8Array }[], patch: Record<string, unknown> = {}) => ({
  game: 'Relic of the Past',
  module: 'relic_of_the_past',
  worldVersion: '0.1.0',
  appVersion: '0.1.0',
  minimumAp: builds[0]?.ap,
  maximumAp: builds[builds.length - 1]?.ap,
  builds: builds.map(({ ap, bytes }) => ({
    archipelagoVersion: ap,
    file: `relic_of_the_past-ap${ap}.apworld`,
    sha256: sha256Of(bytes),
    size: bytes.length,
    bundle: `relic_of_the_past-ap${ap}.apworld.sigstore.json`,
  })),
  ...patch,
});

const standardOf = (bytes: Uint8Array, patch: Record<string, unknown> = {}) => ({
  format: 1,
  game: 'Relic of the Past',
  module: 'relic_of_the_past',
  worldVersion: '0.2.0',
  minimumAp: '0.6.4',
  direct: true,
  kit: '0.2.0',
  world: { file: 'relic_of_the_past.apworld', sha256: sha256Of(bytes), size: bytes.length },
  ...patch,
});

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

const bytesResponse = (bytes: Uint8Array) => new Response(Buffer.from(bytes), { status: 200 });

const missing = () => new Response('', { status: 404 });

const routed = (routes: Record<string, () => Response>): typeof fetch => (input) => {
  const url = String(input);
  const route = routes[url] ?? (url === STANDARD_URL ? missing : undefined);
  return route ? Promise.resolve(route()) : Promise.reject(new Error(`offline: ${String(input)}`));
};

const communityEntry = (apworld: string, patch: Partial<CatalogEntry> = {}): CatalogEntry => ({
  apworld, game: apworld, displayName: apworld, tags: ['community'], source: 'index', stability: 'stable',
  versions: [{ version: '9.9.9', url: `https://example.com/${apworld}.apworld` }], ...patch,
});

export {
  BUNDLE_URL, MANIFEST_URL, REGISTRY_URL, STANDARD_URL, WORLD_URL, buildBundleUrl, buildUrl, buildsManifestOf, bytesResponse, communityEntry, json, manifestOf, missing, registryOf, routed, sha256Of, standardOf, worldBytes,
};
