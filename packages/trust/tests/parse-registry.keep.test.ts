/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { parseRegistry } from '../src/registry/parse-registry';

const trust = (patch: Record<string, unknown> = {}) => ({
  method: 'github-attestation',
  repo: 'owner/repo',
  workflow: '.github/workflows/release.yml',
  refs: ['refs/heads/main'],
  issuer: 'https://token.actions.githubusercontent.com',
  ...patch,
});

const client = (patch: Record<string, unknown> = {}) => ({
  id: 'demo',
  name: 'Demo',
  homepage: 'https://example.com',
  games: ['Demo Game'],
  status: 'active',
  trust: trust(),
  ...patch,
});

const game = (patch: Record<string, unknown> = {}) => ({
  game: 'Demo Game',
  module: 'demo_game',
  displayName: 'Demo Game',
  home: 'https://example.com',
  tags: ['puzzle'],
  client: 'demo',
  release: { repo: 'owner/repo', world: 'demo_game.apworld', manifest: 'demo_game.apworld.json', bundle: 'demo_game.apworld.sigstore.json' },
  ...patch,
});

const file = (clients: unknown[], games: unknown[] = []) => ({ format: 1, clients, games });

describe('parseRegistry', () => {
  test('reads clients and games', () => {
    const parsed = parseRegistry(file([client()], [game()]));
    expect(parsed).toMatchObject({ ok: true, problems: [] });
    if (!parsed.ok) return;
    expect(parsed.registry.clients[0]).toMatchObject({ id: 'demo', status: 'active', trust: { repo: 'owner/repo', refs: ['refs/heads/main'] } });
    expect(parsed.registry.games[0]).toMatchObject({ module: 'demo_game', client: 'demo' });
  });

  test('accepts an empty games list, so a client can come before its game', () => {
    expect(parseRegistry(file([client()]))).toMatchObject({ ok: true });
  });

  test('ignores fields it does not know, so a newer file still loads', () => {
    const parsed = parseRegistry({ ...file([client({ extra: 1, trust: trust({ note: 'x' }) })], [game({ added: true })]), later: [] });
    expect(parsed).toMatchObject({ ok: true, problems: [] });
  });

  test.each([
    ['null', null],
    ['an array', []],
    ['a string', 'registry'],
    ['an unknown format', { format: 2, clients: [], games: [] }],
    ['no format', { clients: [], games: [] }],
    ['no clients list', { format: 1, games: [] }],
    ['no games list', { format: 1, clients: [] }],
  ])('refuses %s', (_name, value) => {
    expect(parseRegistry(value).ok).toBe(false);
  });

  test('refuses a file that lists one client id twice', () => {
    const parsed = parseRegistry(file([client(), client({ name: 'Copy', status: 'revoked' })]));
    expect(parsed).toEqual({ ok: false, problems: ['client id demo is listed twice'] });
  });

});

describe('parseRegistry drops what is malformed', () => {
  test.each([
    ['an id that is not a slug', client({ id: 'Not A Slug' })],
    ['a missing name', client({ name: '' })],
    ['games that are not names', client({ games: [1] })],
    ['an unknown status', client({ status: 'pending' })],
    ['an unknown trust method', client({ trust: trust({ method: 'ed25519' }) })],
    ['a repo that is not owner/name', client({ trust: trust({ repo: 'owner' }) })],
    ['a workflow outside .github/workflows', client({ trust: trust({ workflow: 'release.yml' }) })],
    ['no refs', client({ trust: trust({ refs: [] }) })],
    ['a ref that is not a branch or tag', client({ trust: trust({ refs: ['main'] }) })],
    ['no issuer', client({ trust: trust({ issuer: undefined }) })],
  ])('drops a client with %s and keeps the others', (_name, bad) => {
    const parsed = parseRegistry(file([bad, client({ id: 'good' })]));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.registry.clients.map((entry) => entry.id)).toEqual(['good']);
    expect(parsed.problems).toHaveLength(1);
  });

  test.each([
    ['a module that is not a python name', game({ module: 'Not-Valid' })],
    ['no release', game({ release: undefined })],
    ['an incomplete release', game({ release: { repo: 'owner/repo' } })],
    ['an unknown client', game({ client: 'nobody' })],
  ])('drops a game with %s', (_name, bad) => {
    const parsed = parseRegistry(file([client()], [bad, game({ game: 'Second', module: 'second' })]));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.registry.games.map((entry) => entry.module)).toEqual(['second']);
    expect(parsed.problems).toHaveLength(1);
  });
});
